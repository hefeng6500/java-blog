# 网络通信

## UDP

```java
// 接收消息端（Server.java）
import java.net.*;

public class Server {
    public static void main(String args[]) throws Exception {
        int port = 5005;
        
        DatagramSocket serverSocket = new DatagramSocket(port);
        byte[] receiveData = new byte[1024];
        DatagramPacket receivePacket = new DatagramPacket(receiveData, receiveData.length);
        System.out.println("Listening on port " + port + "...");
        
        while (true) {
            serverSocket.receive(receivePacket);
            String message = new String(receivePacket.getData(), 0, receivePacket.getLength());
            System.out.println("Received message: " + message);
        }
    }
}
```

```java
// 发送消息端（Client.java
import java.net.*;

public class Client {
    public static void main(String args[]) throws Exception {
        InetAddress IPAddress = InetAddress.getByName("127.0.0.1");
        int port = 5005;
        String[] messages = {"Hello, World!", "How are you?", "Goodbye!"};
        
        DatagramSocket clientSocket = new DatagramSocket();
        
        for (String message : messages) {
            byte[] sendData = message.getBytes();
            DatagramPacket sendPacket = new DatagramPacket(sendData, sendData.length, IPAddress, port);
            clientSocket.send(sendPacket);
        }
        
        clientSocket.close();
    }
}

```



**如何实现广播**

发送端目的 IP 使用广播IP： 255.255.255.255  9999。所在网段的其他主机对应了端口（9999）即可接收消息。



**如何实现组播**，

发送端目的 IP 使用组播 IP，且指定端口。所在网段的其他主机注册了该组播 IP 和对应端口即可接收消息。

## TCP

**tcp 通信示例**

```java
package com.yang.tcp;

import java.io.*;
import java.net.*;

public class TCPServer {
    public static void main(String[] args) throws Exception {
        int port = 5005;

        // ServerSocket类,注册端口
        ServerSocket serverSocket = new ServerSocket(port);
        System.out.println("Server started on port " + port);

        // 调用accept()方法阻塞等待接收客户端连接。得到Socket对象
        Socket socket = serverSocket.accept();
        System.out.println("Client connected: " + socket.getInetAddress().getHostAddress());

        BufferedReader in = new BufferedReader(new InputStreamReader(socket.getInputStream()));
        PrintWriter out = new PrintWriter(socket.getOutputStream(), true);

        String message = in.readLine();
        System.out.println("Received message: " + message);

        out.println("Message received: " + message);

        in.close();
        out.close();
        socket.close();
        serverSocket.close();
    }
}
```

```java
package com.yang.tcp;

import java.io.*;
import java.net.*;

public class TCPClient {
    public static void main(String[] args) throws Exception {
        String message = "Hello, World!";
        String host = "localhost";
        int port = 5005;

        Socket socket = new Socket(host, port);

        PrintWriter out = new PrintWriter(socket.getOutputStream(), true);
        BufferedReader in = new BufferedReader(new InputStreamReader(socket.getInputStream()));

        out.println(message);
        String response = in.readLine();
        System.out.println("Received message: " + response);

        out.close();
        in.close();
        socket.close();
    }
}
```



### TCP通信-多发多收消息

该代码包括服务端和客户端两个部分，其中服务端通过死循环来接收和处理多个客户端发送的消息，而客户端通过死循环等待用户输入消息并发送给服务端，如果用户输入exit，则关闭客户端并释放资源。

```java	
// Server.java
package com.yang.multiTcp;

import java.io.*;
import java.net.*;

public class Server {
    public static void main(String[] args) throws IOException {
        ServerSocket serverSocket = null;
        Socket clientSocket = null;
        PrintWriter out = null;
        BufferedReader in = null;

        try {
            serverSocket = new ServerSocket(8000); // 创建服务器Socket，监听端口8000
            System.out.println("Server started.");

            while (true) {
                clientSocket = serverSocket.accept(); // 等待客户端连接
                System.out.println("Client connected.");

                // 获取客户端输入流
                in = new BufferedReader(new InputStreamReader(clientSocket.getInputStream()));

                // 获取客户端输出流
                out = new PrintWriter(clientSocket.getOutputStream(), true);

                String inputLine;
                while ((inputLine = in.readLine()) != null) {
                    System.out.println("Received message: " + inputLine);
                    out.println("Server received message: " + inputLine);
                }

                // 关闭连接
                out.close();
                in.close();
                clientSocket.close();
            }
        } catch (IOException e) {
            System.err.println("Could not listen on port: 8000.");
            System.exit(1);
        } finally {
            serverSocket.close();
        }
    }
}


```

```java
// Client.java
package com.yang.multiTcp;

import java.io.*;
import java.net.*;

public class Client {
    public static void main(String[] args) throws IOException {
        Socket socket = null;
        PrintWriter out = null;
        BufferedReader in = null;
        BufferedReader stdIn = null;

        try {
            socket = new Socket("localhost", 8000); // 创建客户端Socket，连接服务器

            // 获取客户端输入流
            in = new BufferedReader(new InputStreamReader(socket.getInputStream()));

            // 获取客户端输出流
            out = new PrintWriter(socket.getOutputStream(), true);

            // 获取用户输入流
            stdIn = new BufferedReader(new InputStreamReader(System.in));

            String userInput;
            while ((userInput = stdIn.readLine()) != null) {
                out.println(userInput); // 将用户输入发送给服务器

                if (userInput.equals("exit")) {
                    break;
                }

                String response = in.readLine(); // 接收服务器响应
                System.out.println("Server response: " + response);
            }
        } catch (UnknownHostException e) {
            System.err.println("Don't know about host: localhost.");
            System.exit(1);
        } catch (IOException e) {
            System.err.println("Couldn't get I/O for the connection to: localhost.");
            System.exit(1);
        } finally {
            // 关闭连接
            out.close();
            in.close();
            stdIn.close();
            socket.close();
        }
    }
}


```



**目前服务端是单线程的，每次只能处理一个客户端的消息。**

为什么？**单线程每次只能处理一个客户端的Socket通信**



如何才可以让服务端可以处理多个客户端的通信需求？

**引入多线程**



### TCP通信-同时接受多个客户端消息

```java
// Server
package com.yang.multiClientMessageTcp;

import java.io.*;
import java.net.*;

public class Server {
    public static void main(String[] args) throws IOException {
        ServerSocket serverSocket = null;

        try {
            serverSocket = new ServerSocket(8000); // 创建服务器Socket，监听端口8000
            System.out.println("Server started.");

            while (true) {
                Socket clientSocket = serverSocket.accept(); // 等待客户端连接
                System.out.println("Client connected.");

                // 创建新线程来处理客户端的请求
                Thread thread = new ServerThread(clientSocket);
                thread.start();
            }
        } catch (IOException e) {
            System.err.println("Could not listen on port: 8000.");
            System.exit(1);
        } finally {
            serverSocket.close();
        }
    }
}

class ServerThread extends Thread {
    private Socket socket;
    private PrintWriter out;
    private BufferedReader in;

    public ServerThread(Socket socket) {
        this.socket = socket;
    }

    public void run() {
        try {
            // 获取客户端输入流: 是为了能够读取客户端发来的消息
            in = new BufferedReader(new InputStreamReader(socket.getInputStream()));

            // 获取客户端输出流: 是为了能够向客户端发送消息
            out = new PrintWriter(socket.getOutputStream(), true);

            String inputLine;
            while ((inputLine = in.readLine()) != null) {
                System.out.println("Received message: " + inputLine);
                out.println("Server received message: " + inputLine);
            }

            // 关闭连接
            out.close();
            in.close();
            socket.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

服务端需要获取客户端的输入流，是为了能够读取客户端发来的消息。服务端需要获取客户端的输出流，是为了能够向客户端发送消息。



```java
// Client
package com.yang.multiClientMessageTcp;

import java.io.*;
import java.net.*;

public class Client {
    public static void main(String[] args) throws IOException {
        Socket clientSocket = null;
        PrintWriter out = null;
        BufferedReader in = null;

        try {
            clientSocket = new Socket("localhost", 8000); // 创建客户端Socket，连接到服务端的8000端口
            out = new PrintWriter(clientSocket.getOutputStream(), true);
            in = new BufferedReader(new InputStreamReader(clientSocket.getInputStream()));

            // 创建新线程来处理接收消息
            Thread receiveThread = new ReceiveThread(in);
            receiveThread.start();

            // 循环读取用户输入并发送消息
            BufferedReader stdIn = new BufferedReader(new InputStreamReader(System.in));
            String userInput;
            while ((userInput = stdIn.readLine()) != null) {
                out.println(userInput);
                if (userInput.equals("exit")) {
                    break;
                }
            }

            // 关闭连接
            out.close();
            in.close();
            stdIn.close();
            clientSocket.close();
        } catch (UnknownHostException e) {
            System.err.println("Don't know about host: localhost.");
            System.exit(1);
        } catch (IOException e) {
            System.err.println("Couldn't get I/O for the connection to: localhost.");
            System.exit(1);
        }
    }
}

class ReceiveThread extends Thread {
    private BufferedReader in;

    public ReceiveThread(BufferedReader in) {
        this.in = in;
    }

    public void run() {
        try {
            String inputLine;
            while ((inputLine = in.readLine()) != null) {
                System.out.println("Server: " + inputLine);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}

```



目前的通信架构存在什么问题？

**存在以下几个缺点**：

1. 资源占用问题：每个客户端连接都会创建一个线程，当客户端连接数过多时，服务器会创建大量的线程，占用过多的资源，导致服务器的性能下降，甚至崩溃。
2. 线程安全问题：线程之间共享的数据需要进行同步，否则可能出现数据竞争和线程安全问题。
3. 代码复杂度问题：多线程编程需要考虑线程的启动、中止、同步等问题，代码复杂度高，维护困难。

为了解决这些问题，可以采用以下几种方式来**改进**：

1. 使用线程池技术：通过使用线程池，可以避免为每个客户端连接创建一个线程，减少线程的创建和销毁开销，提高服务器的性能。
2. 使用异步非阻塞IO技术：异步非阻塞IO模型可以使用单线程处理多个客户端请求，大大降低了资源占用问题。
3. 使用NIO技术：Java NIO技术支持非阻塞式IO操作，可以处理大量的并发连接，提高服务器性能。
4. 使用框架：使用开源框架，如Netty、Grizzly等，可以简化多线程编程，提高开发效率，降低代码复杂度。

使用线程池优化服务端代码：

```java
import java.io.*;
import java.net.*;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class Server {

    public static void main(String[] args) throws IOException {
        ExecutorService executorService = Executors.newCachedThreadPool();

        ServerSocket serverSocket = new ServerSocket(8888);
        System.out.println("Server started...");

        while (true) {
            Socket clientSocket = serverSocket.accept();
            System.out.println("Client connected: " + clientSocket);

            executorService.execute(new ServerThread(clientSocket));
        }
    }
}

class ServerThread implements Runnable {
    private final Socket clientSocket;
    private BufferedReader in;
    private PrintWriter out;

    public ServerThread(Socket socket) {
        this.clientSocket = socket;
    }

    @Override
    public void run() {
        try {
            in = new BufferedReader(new InputStreamReader(clientSocket.getInputStream()));
            out = new PrintWriter(clientSocket.getOutputStream(), true);

            String inputLine;
            while ((inputLine = in.readLine()) != null) {
                System.out.println("Received message from client: " + inputLine);
                out.println("Message received: " + inputLine);
            }

            System.out.println("Client disconnected: " + clientSocket);
            clientSocket.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}

```

通过 `ExecutorService` 的 `newCachedThreadPool()` 方法创建了一个可缓存的线程池

当客户端连接时，将客户端的Socket传入ServerThread线程类的构造函数中，将ServerThread对象提交到线程池中进行处理。

每个ServerThread线程都是一个独立的线程，通过客户端Socket对象获取输入流和输出流，进行双向通信。当客户端连接断开时，关闭Socket连接，结束线程的运行。

使用线程池技术可以有效地避免为每个客户端连接创建一个新线程，降低服务器资源占用，提高性能。



## 即时通信

- 即时通信，是指一个客户端的消息发出去，其他客户端可以接收到

- 即时通信需要进行端口转发的设计思想。

- 服务端需要把在线的Socket管道存储起来

- 一旦收到一个消息要推送给其他管道



TCP 即时通信

```java
package com.yang.bs;

import java.io.*;
import java.net.*;
import java.util.*;

public class Server {
    // 用于存储所有已连接的客户端
    private ArrayList<ClientHandler> clients = new ArrayList<>();

    public static void main(String[] args) {
        new Server().runServer();
    }

    public void runServer() {
        try {
            // 创建ServerSocket并监听端口
            ServerSocket serverSocket = new ServerSocket(8000);
            System.out.println("Server started on port 8000...");

            while (true) {
                // 接受客户端连接
                Socket clientSocket = serverSocket.accept();
                System.out.println("Client connected: " + clientSocket);

                // 创建ClientHandler并将其添加到客户端列表中
                ClientHandler client = new ClientHandler(clientSocket, this);
                clients.add(client);

                // 启动ClientHandler线程处理客户端消息
                Thread thread = new Thread(client);
                thread.start();
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    // 用于广播消息给所有客户端
    public void broadcast(String message) {
        for (ClientHandler client : clients) {
            client.sendMessage(message);
        }
    }

    // 用于将客户端从客户端列表中移除
    public void removeClient(ClientHandler client) {
        clients.remove(client);
    }
}

class ClientHandler implements Runnable {
    private Socket clientSocket;
    private Server server;
    private PrintWriter out;
    private BufferedReader in;

    public ClientHandler(Socket clientSocket, Server server) {
        this.clientSocket = clientSocket;
        this.server = server;
    }

    public void run() {
        try {
            // 获取客户端输入流和输出流
            out = new PrintWriter(clientSocket.getOutputStream(), true);
            in = new BufferedReader(new InputStreamReader(clientSocket.getInputStream()));

            String inputLine;
            while ((inputLine = in.readLine()) != null) {
                // 将客户端消息广播给所有客户端
                server.broadcast(inputLine);
            }
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            // 将客户端从客户端列表中移除
            server.removeClient(this);

            try {
                clientSocket.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    // 用于向客户端发送消息
    public void sendMessage(String message) {
        out.println(message);
    }
}


```

```java
package com.yang.bs;

import java.io.*;
import java.net.*;
import java.util.*;

public class Client {
    public static void main(String[] args) {
        try {
            // 创建Socket并连接到服务器
            Socket socket = new Socket("localhost", 8000);
            System.out.println("Connected to server: " + socket);

            // 获取输入流和输出流
            PrintWriter out = new PrintWriter(socket.getOutputStream(), true);
            BufferedReader in = new BufferedReader(new InputStreamReader(socket.getInputStream()));

            // 创建一个线程用于接收服务器发送的消息
            Thread thread = new Thread(() -> {
                try {
                    String inputLine;
                    while ((inputLine = in.readLine()) != null) {
                        System.out.println(inputLine);
                    }
                } catch (IOException e) {
                    e.printStackTrace();
                }
            });
            thread.start();

            // 读取用户输入并发送到服务器
            Scanner scanner = new Scanner(System.in);
            while (true) {
                String message = scanner.nextLine();
                out.println(message);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

上述例子， 客户端记得 idea 多实例多开



**BS 开发**

```java
package com.yang.bshttp;

import java.net.ServerSocket;
import java.net.Socket;
import java.util.concurrent.*;
import java.io.PrintStream;

/**
    了解：BS-浏览器-服务器基本了解。

    引入：
        之前客户端和服务端都需要自己开发。也就是CS架构。
        接下来模拟一下BS架构。

    客户端：浏览器。（无需开发）
    服务端：自己开发。
    需求：在浏览器中请求本程序，响应一个网页文字给浏览器显示


 */
public class BSserverDemo {
    // 使用静态变量记住一个线程池对象
    private static ExecutorService pool = new ThreadPoolExecutor(3,
            5, 6, TimeUnit.SECONDS,
            new ArrayBlockingQueue<>(2)
            , Executors.defaultThreadFactory(), new ThreadPoolExecutor.AbortPolicy());

    public static void main(String[] args) {
        try {
            // 1.注册端口
            ServerSocket ss = new ServerSocket(8080);
            // 2.创建一个循环接收多个客户端的请求。
            while(true){
                Socket socket = ss.accept();
                // 3.交给一个独立的线程来处理！
                pool.execute(new ServerReaderRunnable(socket));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}

public class ServerReaderRunnable implements Runnable{
    private Socket socket;
    public ServerReaderRunnable(Socket socket){
        this.socket = socket;
    }
    @Override
    public void run() {
        try {
            // 浏览器 已经与本线程建立了Socket管道
            // 响应消息给浏览器显示
            PrintStream ps = new PrintStream(socket.getOutputStream());
            // 必须响应HTTP协议格式数据，否则浏览器不认识消息
            ps.println("HTTP/1.1 200 OK"); // 协议类型和版本 响应成功的消息！
            ps.println("Content-Type:text/html;charset=UTF-8"); // 响应的数据类型：文本/网页

            ps.println(); // 必须发送一个空行

            // 才可以响应数据回去给浏览器
            ps.println("<span style='color:red;font-size:90px'>你好世界！</span>");
            ps.close();
        } catch (Exception e) {
            System.out.println(socket.getRemoteSocketAddress() + "下线了！！！");
        }
    }
}
```





