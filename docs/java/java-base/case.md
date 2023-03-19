# ATM 管理系统

```java
//账户类
public class Account {
    //    成员变量，私有
    private String cardId;
    private String userName;//用户名
    private String passWord;//密码
    private double money;//账户余额
    private double quotaMoney;//每次取现额度


    public String getCardId() {
        return cardId;
    }

    public void setCardId(String cardId) {
        this.cardId = cardId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getPassWord() {
        return passWord;
    }

    public void setPassWord(String passWord) {
        this.passWord = passWord;
    }

    public double getMoney() {
        return money;
    }

    public void setMoney(double money) {
        this.money = money;
    }

    public double getQuotaMoney() {
        return this.quotaMoney;
    }

    public void setQuotaMoney(double quotaMoney) {
        this.quotaMoney = quotaMoney;
    }
}
```

```java
import java.util.ArrayList;
import java.util.Random;
import java.util.Scanner;

public class Case_01_ATM {
    public static void main(String[] args) {
        ArrayList<Account> accounts = new ArrayList<>();
        Scanner sc = new Scanner(System.in);//放置外侧避免循环生成很多的扫描器
        while (true) {
            System.out.println("===========黑马程序员系统===========");
            System.out.println("1、账户登陆");
            System.out.println("2、账户开户");

            System.out.println("请输入您的选择:");
            int command = sc.nextInt();
            switch (command) {
                case 1:
                    login(accounts, sc);
                    break;
                case 2:
                    //用户开户
                    register(accounts, sc);
                    break;
                default:
                    System.out.println("您输入的操作命令错误！！");
            }
        }
    }

    /**
     * 用户登陆功能
     *
     * @param accounts
     * @param sc
     */
    private static void login(ArrayList<Account> accounts, Scanner sc) {
        System.out.println("==========登陆操作系统==========");
        if (accounts.size() == 0) {
            System.out.println("对不起，您没有注册任何账户，请先进行账户注册！！！");
            return;//卫风格，解决方法的执行。
        }
        while (true) {
            System.out.println("请您输入登陆卡号:");
            String cardId = sc.next();
            Account acc = getAccountByCard(cardId, accounts);
            if (acc != null) {
                while (true) {
                    System.out.println("请您输入登陆密码:");
                    String passWord = sc.next();
                    if (acc.getPassWord().equals(passWord)) {
                        System.out.println("恭喜您账户登陆成功!账户:" + acc.getUserName());
                        //进入登陆账户成功的界面当中
                        showUserPanel(sc, acc, accounts);
                        return;
                    } else {
                        System.out.println("读不起，您输入的密码有误！！");
                    }
                }
            }
        }


    }

    /**
     * 用户操作页界面方法
     *
     * @param sc
     * @param acc
     * @param accounts
     */
    private static void showUserPanel(Scanner sc, Account acc, ArrayList<Account> accounts) {//由于需要转账给别的账户，所以需要添加账户的集合，从集合中选择找到出需要转账的账户
        while (true) {
            System.out.println("=============用户操作页===========");
            System.out.println("1、查询账户:");
            System.out.println("2、存款");
            System.out.println("3、取款");
            System.out.println("4、转账");
            System.out.println("5、修改密码");
            System.out.println("6、退出");
            System.out.println("7、注销账户");
            System.out.println("请选择:");
            int command = sc.nextInt();

            switch (command) {
                case 1:
                    showAccount(acc);//用户账户信息展示。
                    break;

                case 2:
                    //用户存钱
                    pushMoney(acc, sc);
                    break;

                case 3:
                    //用户取钱
                    getMoney(acc, sc);
                    break;

                case 4:
                    //转账处理
                    tranformMoney(acc, sc, accounts);
                    break;

                case 5:
                    updatePassword(acc, sc, accounts);
                    return;

                case 6:
                    System.out.println("退出当前的账户！！！");
                    return;//干掉所在的这个方法，即所在的方式是展示账户的这个方法。

                case 7:
                    boolean bool = deleteAccount(acc, sc, accounts);
                    if (bool) {
                        return;//表示如果销户成功则返回到总的操作登陆界面
                    } else {
                        break;//表示销户失败返回到账户登陆界面
                    }
                default:
                    System.out.println("您输入的操作有误，请重新输入！！！");
            }
        }
    }

    /**
     * 注销账户
     *
     * @param acc
     * @param sc
     * @param accounts
     */
    private static boolean deleteAccount(Account acc, Scanner sc, ArrayList<Account> accounts) {//使用布尔类型来对界面进行选择，如果销户成功则返回到登陆界面，如果未销户成功则继续但回到账户操作界面
        System.out.println("您是否注销账户? Y/N");
        String command = sc.next();
        //指令判断
        if (command == "Y") {
            if (acc.getMoney() > 0) {
                System.out.println("您的账户目前还存在余额，提取后再注销！！！");
                return true;
            }
            accounts.remove(acc);
            System.out.println("您的账户已被注销！！！");

        } else {
            System.out.println("您的账户依旧保留！！！");
        }
        return false;
    }

    /**
     * 修改密码方法
     *
     * @param acc
     * @param sc
     * @param accounts
     */
    private static void updatePassword(Account acc, Scanner sc, ArrayList<Account> accounts) {
        System.out.println("=============用户操作页===========");

        System.out.println("请输入您的原始密码:");
        String passWord = sc.next();
        //1、判断这个密码是否正确
        if (acc.getPassWord().equals(passWord)) {

            //密码正确
            //2、输入新密码
            while (true) {
                System.out.println("请您输入新的密码:");
                String newPassword = sc.next();
                System.out.println("请您再次输入新的密码:");
                String okPassword = sc.next();

                if (newPassword.equals(okPassword)) {
                    System.out.println("恭喜您密码修改成功！");
                    acc.setPassWord(newPassword);
                    return;//干掉当前的方法
                } else {
                    System.out.println("您输入的两次密码不一致~~");
                }
            }
        } else {
            System.out.println("对不起，您输入的密码不正确！！！");
        }
    }

    /**
     * 账户转账方法
     *
     * @param acc
     * @param sc
     * @param accounts
     */
    private static void tranformMoney(Account acc, Scanner sc, ArrayList<Account> accounts) {
        System.out.println("================转账界面操作==============");
        //1、判断是否有额外的账户可以转账
        if (accounts.size() < 2) {
            System.out.println("请您再注册一个新的账户，进行账户之间的转账。");
            return;
        }
        //2、判断账户是否有余额
        if (acc.getMoney() == 0) {
            System.out.println("对不起，您的账户余额没有钱！！！");
            return;
        }
        //3、输入对方的账号
        while (true) {
            System.out.println("请您输入对方账户的卡号:");
            String cardid = sc.next();
            //4、判断是否自己的账户
            if (cardid.equals(acc.getCardId())) {
                System.out.println("对不起，您不能转账给自己！！！");
                //            continue;
            }
            //判断卡号的存在
            Account account = getAccountByCard(cardid, accounts);
            if (account == null) {
                System.out.println("对不起，您输入的对方账户不存在");
            } else {
                //如果对象存在，继续进行转账，并进行姓氏的验证
                String userName = account.getUserName();
                String tip = "*" + userName.substring(1);//subtring 是截取从索引1到最后。前后进行拼接
                System.out.println("请你输入[" + tip + "]的姓氏");
                String preName = sc.next();

                //验证姓氏是否正确

                if (userName.equals(preName)) {
                    //认证通过，开始转账
                    while (true) {
                        System.out.println("请您输入转账金额:");
                        double money = sc.nextDouble();
                        //判断金额是否足够
                        if (money > acc.getMoney()) {
                            System.out.println("对不起，您的账户余额不足！！！");
                        } else {
                            acc.setMoney(acc.getMoney() - money);
                            account.setMoney(account.getMoney() + money);
                            System.out.println("转账成功，您的余额:" + acc.getMoney());
                            return;
                        }
                    }
                } else {
                    System.out.println("对不起，您输入的信息有误！");
                }

            }
        }
    }

    /**
     * 用户取钱方法
     *
     * @param acc
     * @param sc
     */
    private static void getMoney(Account acc, Scanner sc) {
        System.out.println("================取钱界面操作==============");

        if (acc.getMoney() < 100) {
            System.out.println("您当前的余额不足100，不能够进行取钱操作。");
            return;//干掉用户取钱的方法
        }
        System.out.println("请输入您的取钱多少:");
        double money = sc.nextDouble();
        if (money > acc.getMoney()) {
            System.out.println("您的账户总金额不足，请您重新选择取款金额。");
        } else if (money > acc.getQuotaMoney()) {
            System.out.println("您当前的取款金额超出总金额，请重新输入。");
        } else {
            System.out.println("恭喜您取款成功！");
            acc.setMoney(acc.getMoney() - money);
            System.out.println("您的账户信息如下所示");
            showAccount(acc);
            return;//干掉取钱的方法回到用户操作界面页

        }
    }

    /**
     * 用户存钱方法
     *
     * @param acc
     * @param sc
     */
    private static void pushMoney(Account acc, Scanner sc) {
        System.out.println("================存钱界面操作==============");
        System.out.println("请您输入存款多少:");
        double money = sc.nextDouble();
        acc.setMoney(acc.getMoney() + money);//对帐户的余额进行存款处理。
        System.out.println("恭喜您存款成功，账户信息通过如下进行查询！！");
        showAccount(acc);//存钱后账户信息展示。
        return;
    }

    /**
     * 账户信息查看
     *
     * @param acc
     */
    private static void showAccount(Account acc) {
        System.out.println("用户名:" + acc.getUserName());
        System.out.println("用户余额:" + acc.getMoney());
        System.out.println("用户账号:" + acc.getCardId());
        System.out.println("用户限额:" + acc.getQuotaMoney());

    }

    /**
     * 用户开户的实现
     *
     * @param accounts 接收账户的集合
     */
    private static void register(ArrayList<Account> accounts, Scanner sc) {
        Account account = new Account();
        //对数组中的用户名生成
        System.out.println("请输入用户名:");
        String username = sc.next();
        account.setUserName(username);

        //对数组中的密码生成
        while (true) {
            System.out.println("请您输入密码:");
            String password = sc.next();
            System.out.println("请您再次输入密码:");
            String okpassword = sc.next();
            if (okpassword.equals(password)) {
                account.setPassWord(password);
                break;//结束死循环
            } else {
                System.out.println("您输入的两次密码不正确，请再次输入！！");
            }
        }
        //对数组中的限额生成
        System.out.println("请您设置每次提取的限额:");
        double qutoaMoney = sc.nextDouble();
        account.setQuotaMoney(qutoaMoney);
        //对数组中的卡号生成
        String cardId = getRandomCardId(accounts);
        account.setCardId(cardId);

        //将新生成的数组对象添加到数组类中去
        accounts.add(account);
        System.out.println("恭喜您" + username + "开户成功！" + "您的卡号:" + cardId);


    }

    /**
     * 生成8位随机的卡号
     *
     * @param accounts
     * @return
     */
    private static String getRandomCardId(ArrayList<Account> accounts) {
        while (true) {
            Random r = new Random();
            String randomNumber = "";
            for (int i = 0; i < 8; i++) {
                randomNumber += r.nextInt(10);
            }
            //判断是否重复
            Account acc = getAccountByCard(randomNumber, accounts);
            if (acc == null) {//验证查询是否存在，即唯一账号。
                return randomNumber;
            }

        }
    }

    /**
     * 检验生成的卡号是否唯一
     *
     * @param randomNumber 生成的8位随机卡号
     * @param accounts     Account类的对象
     * @return 返回acc 或者null
     */
    private static Account getAccountByCard(String randomNumber, ArrayList<Account> accounts) {
        //获取Account类中元素
        for (int i = 0; i < accounts.size(); i++) {
            Account acc = accounts.get(i);
            if (acc.getCardId().equals(randomNumber)) {
                return acc;//提示卡号
            }
        }
        return null;//查询账户是否存在
    }
}
```
