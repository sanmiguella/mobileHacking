Java.perform(function () {
    // Hooking StringBuffer.toString()
    // This forces the return value of toString() to always be "a2a3d412e92d896134d9c9126d756f"
    var StringBuffer = Java.use("java.lang.StringBuffer");
    StringBuffer.toString.overload().implementation = function () {
        console.log("\n     [*] Hooked StringBuffer.toString(), returning 'a2a3d412e92d896134d9c9126d756f'");
        return "a2a3d412e92d896134d9c9126d756f";
    };

    // Hooking b.a() function
    // This logs the original return value of b.a() but does NOT modify it.
    // It can help us understand what this method returns.
    let b = Java.use("c.b.a.b"); // Replace "c.b.a.b" with actual class if different
    b["a"].implementation = function (str) {
        let result = this["a"](str); // Call the original method
        console.log(`\n     [*] Hooked b.a(), result=${result}`);
        return result; // Return the original result without modifying it
    };
});