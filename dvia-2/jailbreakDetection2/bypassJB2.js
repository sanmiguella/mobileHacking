const jailbreakPaths = [
    "/Applications/Cydia.app",
    "/Library/MobileSubstrate/MobileSubstrate.dylib",
    "/bin/bash",
    "/usr/sbin/sshd",
    "/etc/apt"
];

// App URL list in lower case for canOpenURL
const canOpenURL = [
    "cydia",
];

if (ObjC.available) {
    try {
        //Hooking fileExistsAtPath:
        Interceptor.attach(ObjC.classes.NSFileManager["- fileExistsAtPath:"].implementation, {
            onEnter(args) {
                // Use a marker to check onExit if we need to manipulate
                // the response.
                this.is_common_path = false;
                
                // Extract the path
                this.path = new ObjC.Object(args[2]).toString();
                
                // check if the looked up path is in the list of common_paths
                if (jailbreakPaths.indexOf(this.path) >= 0) {
                    // Mark this path as one that should have its response
                    // modified if needed.
                    this.is_common_path = true;
                }
            },
            onLeave(retval) {
                // stop if we dont care about the path
                if (!this.is_common_path) {
                    return;
                }

                // ignore failed lookups
                if (retval.isNull()) {
                    return;
                }
                console.log(`fileExistsAtPath: bypassing ` + this.path);
                retval.replace(new NativePointer(0x00));
            },
        });

        //Hooking canOpenURL for Cydia
        Interceptor.attach(ObjC.classes.UIApplication["- canOpenURL:"].implementation, {
            onEnter(args) {
                this.is_flagged = false;
                // Extract the path
                this.path = new ObjC.Object(args[2]).toString();
                let app = this.path.split(":")[0].toLowerCase();
                if (canOpenURL.indexOf(app) >= 0) {
                    this.is_flagged = true;
                }
            },
            onLeave(retval) {
                if (!this.is_flagged) {
                    return;
                }

                // ignore failed
                if (retval.isNull()) {
                    return;
                }
                console.log(`canOpenURL: ` +
                    this.path + ` was successful with: ` +
                    retval.toString() + `, bypassing.`);
                retval.replace(new NativePointer(0x00));
            }
        });
    
        
    } catch (err) {
        console.log("Exception : " + err.message);
    }
} else {
    console.log("Objective-C Runtime is not available!");
}
