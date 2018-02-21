export default (function(){
    
    function test() {

        console.log("testing..!.!");
    }

    function test2(){
        console.log("fn");
     }

    function init() {
        test();
        test2();
    }

    return {
        init        
    }
})();