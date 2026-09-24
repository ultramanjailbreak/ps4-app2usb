#include "ps4.h"

// Custom Notification Function
void send_notification(const char* text) {
    // 0 = Default system information icon
    // You can also use other standard integer icons depending on intent
    sceSysUtilSendSystemNotificationWithText(0, text);
}

// Main execution entry point for the PS4 Bin Loader
int _main(struct thread *td) {
    // Initialize libPS4 internal system structures
    initKernel();
    initLibc();
    initSysUtil();

    // Elevate privileges to run kernel-level execution hooks
    jailbreak();

    // Trigger the notification display banner
    send_notification("Hello from your custom compiled .bin payload!");

    return 0;
}
