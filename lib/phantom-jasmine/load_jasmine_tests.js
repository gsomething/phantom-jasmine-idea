var system = require('system');
var args = system.args;

if (args.length < 2) {
  console.log("Need a url as the second argument");
  phantom.exit(1);
}

PhantomJasmineRunner = (function() {

  function PhantomJasmineRunner(page1, exit_func) {
    this.page = page1;
    this.exit_func = exit_func != null ? exit_func : phantom.exit;
    this.tries = 0;
    this.max_tries = 10;
  }

  PhantomJasmineRunner.prototype.get_status = function() {
    return this.page.evaluate(function() {
      return console_reporter.status;
    });
  };

  PhantomJasmineRunner.prototype.terminate = function() {
    switch (this.get_status()) {
      case "success":
        return this.exit_func(0);
      case "fail":
        return this.exit_func(1);
      default:
        return this.exit_func(2);
    }
  };

  return PhantomJasmineRunner;

})();

var page    = new WebPage();
var runner  = new PhantomJasmineRunner(page);

page.onConsoleMessage = function(msg) {
  console.log(msg);
  if (msg === "ConsoleReporter finished") {
    return runner.terminate();
  }
};

var system = require('system');
var args = system.args;

address = args[1];

page.open(address, function(status) {
  if (status !== "success") {
    console.log("can't load the address!");
    return phantom.exit(1);
  }
});
