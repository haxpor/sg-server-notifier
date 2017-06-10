# sg-server-notifier


# Setup

Add following environment variable to your system/server by any mean (recommended via `export`)

`SGSERVER_WEBHOOK=xxxx` in which xxxx is your webhook you got from Slack for your new integration with it.

Then just execute

`node index.js &` (preferrably `node index.js > /dev/null 2>&1 &`

It will check for critical processes if they are down then it will notify a proper message according to that process to slack.

# License

[GNU General Public License v3.0](https://github.com/haxpor/sg-server-notifier/blob/master/LICENSE), Wasin Thonkaew
