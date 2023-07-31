# SpringBoot 整合 CORS 跨域访问

## 什么是跨域访问

跨域访问

说到跨域访问，必须先解释一个名词：同源策略。所谓同源策略就是在浏览器端出于安全考量，向服务端发起请求必须满足：协议相同、Host(ip)相同、端口相同的条件，否则访问将被禁止，该访问也就被称为跨域访问。

## 什么是 CORS

CORS

CORS，全称"跨域资源共享"(Cross-originresourcesharing)，通过修改 Http 协议 header 的方式，实现跨域。说的简单点就是，通过设置 HTTP 的响应头信息，告知浏览器哪些情况在不符合同源策略的条件下也可以跨域访问，浏览器通过解析 Http 协议中的 Header 执行具体判断。

::: warning
CROS 跨域常用 header

- Access-Control-Allow-Origin： 允许哪些 ip 或域名可以跨域访问
- Access-Control-Max-Age：表示在多少秒之内不需要重复校验该请求的跨域访问权限
- Access-Control-Allow-Credentials：只会在服务器支持通过 cookies 传递验证信息的返回数据里。它的值只有一个就是 true。跨站点带验证信息时，服务器必须要争取设置这个值，服务器才能获取到用户的 cookie。
- Access-Control-Allow-Methods： 表示允许跨域请求的 HTTP 方法，如：GET,POST,PUT,DELETE
- Access-Control-Allow-Headers： 表示访问请求中允许携带哪些 Header 信息，如：Accept、Accept-Language、Content-Language、Content-Type
  :::

## CORS 的分类

浏览器通常会将 CORS 请求分为两类：

**简单请求：** HEAD，GET，POST，HTTP 头部信息不超出几个字段。浏览器直接发出 CORS 请求，在头信息中添加一个 Origin 字段，用来说明请求来自哪个源，服务器根据这个值，决定是否同意这次请求。

如果服务器不许可，则返回的信息中不会包含 Access-Control-Allow-Origin 字段，这个错误需要 onerror 捕获， 返回的状态码可能为 200
如果服务器许可，则服务器返回的响应中会多出 Access-Control-字段
CORS 默认不发送 cookie，需要发送 cookies，则需要服务器指定 Access-Control-Allow-Credentials 字段，需要在 ajax 请求中打开 withCredentials 属性

**非简单请求：** 只请求页面的首部，可以判断一个资源是否存在。请求方法是 PUT 或 DELETE，Content-Type 字段类型是 application/json 会在正式通信前，增加一次 OPTIONS 查询请求，预检请求询问服务器，网页所在域名是否在服务器的许可名单中，以及可以使用那些 HTTP 动词和头信息字段，只有得到肯定答复，浏览器才会发出正式 XMLHTTPRequest 请求，否则会报错。服务器通过预检请求，以后每次浏览器正常 CORS 请求，都会和简单请求一样，会有一个 Origin 字段，服务器的回应也会有 yieldAccess-Control-Allow-Origin 头信息字段。

## CORS 的几种配置方式

::: warning
springboot 中是通过 CorsFilter 来实现的。
:::

### 1、使用 CorsFilter 进行全局跨域配置

```java
// 方式一
@Configuration
public class GlobalCorsConfig {
    @Bean
    public CorsFilter corsFilter() {

        CorsConfiguration config = new CorsConfiguration();
        //开放哪些ip、端口、域名的访问权限，星号表示开放所有域
        config.addAllowedOrigin("*");
        //是否允许发送Cookie信息
        config.setAllowCredentials(true);
        //开放哪些Http方法，允许跨域访问
        config.addAllowedMethod("GET","POST", "PUT", "DELETE");
        //允许HTTP请求中的携带哪些Header信息
        config.addAllowedHeader("*");
        //暴露哪些头部信息（因为跨域访问默认不能获取全部头部信息）
        config.addExposedHeader("*");

        //添加映射路径，“/**”表示对所有的路径实行全局跨域访问权限的设置
        UrlBasedCorsConfigurationSource configSource = new UrlBasedCorsConfigurationSource();
        configSource.registerCorsConfiguration("/**", config);

         return new CorsFilter(configSource);
    }
}

//方式二
@Configuration
public class GlobalCorsConfig {
	@Bean
    public CorsConfigurationSource corsConfigurationSource(){
        CorsConfiguration configuration = new CorsConfiguration();
        //开放哪些ip、端口、域名的访问权限，星号表示开放所有域
        configuration.setAllowedOrigins(Arrays.asList("*"));
        //开放哪些Http方法，允许跨域访问
        configuration.setAllowedMethods(Arrays.asList("GET","POST"));
        //是否允许发送Cookie信息
        configuration.setAllowCredentials(true);
        //添加映射路径，“/**”表示对所有的路径实行全局跨域访问权限的设置
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**",configuration);
        return source;
    }
}
```

### 2、重写 WebMvcConfigurer 的 addCorsMappings 方法（全局跨域配置）

```java
//jdk8
@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedHeaders("Content-Type","X-Requested-With","accept,Origin","Access-Control-Request-Method","Access-Control-Request-Headers","token")
                .allowedMethods("*")
                .allowedOrigins("*")
                .allowCredentials(true);
    }
}

// 或者

@Configuration
public class GlobalCorsConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")    //添加映射路径，“/**”表示对所有的路径实行全局跨域访问权限的设置
                        .allowedOrigins("*")    //开放哪些ip、端口、域名的访问权限
                        .allowCredentials(true)  //是否允许发送Cookie信息
                        .allowedMethods("GET","POST", "PUT", "DELETE")     //开放哪些Http方法，允许跨域访问
                        .allowedHeaders("*")     //允许HTTP请求中的携带哪些Header信息
                        .exposedHeaders("*");   //暴露哪些头部信息（因为跨域访问默认不能获取全部头部信息）
            }
        };
    }
}
```

### 3、使用 CrossOrigin 注解（局部跨域配置）

将 CrossOrigin 注解加在 Controller 层的方法上，该方法定义的 RequestMapping 端点将支持跨域访问
将 CrossOrigin 注解加在 Controller 层的类定义处，整个类所有的方法对应的 RequestMapping 端点都将支持跨域访问

```java
@RequestMapping("/cors")
@ResponseBody
@CrossOrigin(origins = "http://localhost:8080", maxAge = 3600)
public String cors( ){
    return "cors";
}
```

### 4、使用 HttpServletResponse 设置响应头(局部跨域配置)

```java
@RequestMapping("/cors")
@ResponseBody
public String cors(HttpServletResponse response){
    //使用HttpServletResponse定义HTTP请求头，最原始的方法也是最通用的方法
    response.addHeader("Access-Control-Allow-Origin", "http://localhost:8080");
    return "cors";
}
```

### 5、Spring Security 中的配置

在引入了 Spring Security 之后，SpringSecurity 会自动寻找 name=corsConfigurationSource 的 Bean 实例（1 中的配置），我们会发现前面的方法都不能正确的配置 CORS，每次 preflight request 都会得到一个 401 的状态码，表示请求没有被授权。这时，我们需要开启配置才能让 CORS 正常工作：

```java
@Override
protected void configure(HttpSecurity http) throws Exception {
   http.authorizeRequests()
   		.anyRequest().permitAll()
   		.and()
        // 允许跨域访问
        .cors();
}
```
