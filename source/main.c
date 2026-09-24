#include <ps4.h>

int _main(struct thread *td) {
    // Resolve standard kernel pointers and symbols
    initKernel();
    initLibc();
    
    // Elevate process environment boundaries out of sandbox limits
    jailbreak();

    // Trigger internal OS notification wrapper mapping
    // '0' indicates the standard informational message icon block
    sceSysUtilSendSystemNotificationWithText(0, "Notification compiled via custom GCC parameters successfully!");

    return 0;
}
