# Ziggy Route Debugger

![screenshot.png](images%2Fscreenshot.png)

## Are you leaking routes in your ziggy powered site?

Ziggy Route Debugger is a open-source browser extension that allows you to easily verify that the no sensitive routes
are leaked to guests.

If you used Ziggy with your laravel project (and possibly Inertia.js) you may be leaking routes you don't want to.

Of course these routes will be possibly protected by an auth middleware however there are cases you don't want to expose
those urls to the public. (In my case, we are onboarding clients manually, and there is no registration mechanism
available publicly.)

Leaking routes like below, is a security risk for us therefore we needed a way to easily verify which routes are exposed
in each page. In this example, we are leaking the dashboard, 2FA endpoints and cashier predefined routes.
![leak_example.png](images%2Fleak_example.png)

### Do I really need a browser extension for that?

Definitely not! Feel free to read the json lines of each page manually. It's a nightmare.
![readityourself.gif](images%2Freadityourself.gif)

#### Does this work with all Ziggy websites?
No.

#### Does this work with SSR-rendered Ziggy websites?
No.

#### Does this work in general?
Sometimes.
