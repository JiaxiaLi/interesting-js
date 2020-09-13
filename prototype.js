/*
 * @Author: lijiaxia
 * @Date: 2020-05-26 15:22:41
 * @Email: lijiaxia@3ncto.com
 * @FilePath: /prototype.js
 * @LastEditors: lijiaxia
 * @LastEditTime: 2020-07-03 12:28:37
 */
(function () {
    // 工厂模式：解决创建了多个相似对象的问题，没法知道一个对象的类型
    function createPerson(name, age, job) {
        var o = new Object();
        o.name = name;
        (o.age = age), (o.job = job);
        o.sayName = function () {
            alert(this.name);
        };
        return o;
    }

    var person1 = createPerson("ben", 26, "software engineer");
    console.log("person1", person1);
    var person2 = createPerson("shirley", 26, "student");
    console.log("person2", person2);

    /**
     * 构造函数模式，与工厂模式的区别是：
     * 1.没有显示的创一个新的对象
     * 2.直接将属性和方法赋给了 this 对象
     * 3.没有 return 语句
     *
     * 意义：将它的实例标识为一种特定的类型(构造函数胜过工厂模式的地方)
     * 构造函数与其他函数的唯一区别：调用他们的方式不同（任何函数只要通过 new 操作符来调用，那么它就是构造函数）
     */
    function Person(name, age, job) {
        this.name = name;
        this.age = age;
        this.job = job;
        this.sayName = function () {
            alert(this.name);
        };
    }
    console.log("person3", (person3 = new Person("mike", 32, "doctor")));
    console.log("person4", (person4 = new Person("lily", 23, "sellor")));

    /**
     * 创建 Person 的新实例，必须使用 new 操作符：
     *
     * 1.创建一个新对象
     * 2.将构造函数的作用域赋值给新对象
     * 3.执行构造函数中的代码（为这个新对象添加属性）
     * 4.返回新对象
     */

    // 这两个对象都有一个 constructor(构造函数)属性，该属性指向 Person
    console.log(person3.constructor == Person);
    console.log(person4.constructor == Person);

    /**
     * constructor 属性最初用来标识对象类别的
     * 但是检测对象类型，还是用 instanceof 操作符号更可靠一些
     */

    console.log("person3 instanceof Object", person3 instanceof Object);
    console.log("person3 instanceof Person", person3 instanceof Person);
    console.log("person4 instanceof Object", person4 instanceof Object);
    console.log("person4 instanceof Object", person4 instanceof Person);
    console.log("person1 instanceof Object", person1 instanceof Object);
    console.log("person1 instanceof Person", person1 instanceof Person);
    console.log("person2 instanceof Object", person2 instanceof Object);
    console.log("person2 instanceof Object", person2 instanceof Person);

    //构造函数的问题：每个方法都要在每个实例上重新创建一遍
    console.log(person3.sayName == person4.sayName);

    // =>解决该问题可把 sayName 移到构造函数外部，处于全局作用域
    // =>更好的解决办法：使用 prototype （原型）属性，让所有对象实例概念股向它所包含的属性和方法

    // 原型模式：
    function Person1(name, age, job) {
        this.name = name;
        this.age = age;
        this.job = job;
    }

    Person1.prototype.sayName = function () {
        console.log(this.name);
    };

    var person5 = new Person1("lily", 22, "teacher");
    var person6 = new Person1("Ben", 19, "student");
    person5.sayName();
    person6.sayName();

    // 原型简单写法（字面量写法）：
    // 结果与上方一致，除了 constructor 不再指向 Person2 了
    // 该写法相当于以对象字面量形式创建的新对象，完全重写了默认的 prototype 对象，
    // 因此 constructor 也变成了新对象的 constructor 属性（指向 Object 构造函数）
    function Person2() {}

    Person2.prototype = {
        name: "mike",
        age: 23,
        job: "student",
        sayName: function () {
            console.log(this.name);
        },
    };

    var person7 = new Person2();
    person7.sayName();

    // 原型对象的问题
    // 1.省略了为构造函数传递初始化参数，结果所有实例在默认情况下都将取得相同的属性值
    // 2.原型中所有属性被很多实例共享，尤其是包含引用类型值得属性（无法覆盖），无法使实例拥有只属于自己的全部属性

    // 组合使用构造函数和原型模式（最常见方式）：
    // 方法：
    // 1.使用构造函数定义实例属性，
    // 2.使用原型模式用于定义方法和共享的属性
    //结果：
    // 1.每个实例都会有自己的一份实例属性的副本，
    // 2.又共享着对方法的引用，最大限度的节省内存空间
    // 3.且支持向构造函数传递参数

    function Person3(name, age, job) {
        this.name = name;
        this.age = age;
        this.job = job;
        this.friends = ["Lily", "Ben"];
    }

    Person3.prototype = {
        constructor: Person3,
        sayName: function () {
            console.log("Person3", this.name);
        },
    };

    var person8 = new Person3("Ben", 28, "teacher");
    var person9 = new Person3("Shirley", 20, "student");
    person8.friends.push("mike");
    console.log("person8.friends", person8.friends);
    console.log("person9.friends", person9.friends);
    console.log(
        "person9.friends == person8.friends",
        person9.friends == person8.friends
    );
    console.log(
        "person9.sayName == person8.sayName",
        person9.sayName == person8.sayName
    );

    // 动态原型模式：
    // 可以通过检查某个应该存在的方法是否有效，来决定是否需要初始化原型
    // 使用动态原型模式时，不能使用对象字面量重写原型（否则会切断现有实例与新原型之间的联系）
    function Person4(name, age, job) {
        this.name = name;
        this.age = age;
        this.job = job;
        this.friends = ["Lily", "Ben"];

        if (typeof this.sayName != "function") {
            Person4.prototype.sayName = function () {
                console.log(this.name);
            };
        }
    }

    var person10 = new Person4("Nicholas", 29, "Software Engineer");
    person10.sayName();

    // 寄生构造函数模式：
    // 创建一个函数，该函数的作用仅仅是封装创建对象的代码，然后再返回新创建的对象
    // 存在问题：
    // 构造函数返回的对象与再构造函数外部创建的对象没有什么不同
    // 因此不能依赖 instanceof 操作符来确定对象类型
    function Person5(name, age, job) {
        var o = new Object();
        o.name = name;
        o.age = age;
        o.job = job;
        o.sayName = function () {
            console.log(this.name);
        };
        return o;
    }

    var person11 = new Person5("Ben", 20, "student");
    person11.sayName();

    // 稳妥构造函数模式
    // 特点：
    // 1.新创建对象的实例方法不引用 this
    // 2.不使用 new 操作符调用构造函数
})();
