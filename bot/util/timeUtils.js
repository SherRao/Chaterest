

module.exports = {
    /**
     *  @param d1 - start date
     *  @param d2 - end date
     *  @returns functions to get the difference in hours, minutes, milliseconds, and toString
     *  @usage
     *      diff = getDuration(d1, d2);
     *      console.log(diff.toString());
     */

    getDuration: function(d1, d2) {
        if(!d1 && !d2)
            return "Invalid Time";

        d3 = new Date(d2 - d1);
        d0 = new Date(0);
    
        return {
            getHours: function(){
                return d3.getHours() - d0.getHours();
            },
            getMinutes: function(){
                return d3.getMinutes() - d0.getMinutes();
            },
            getSeconds: function(){
                return d3.getSeconds() - d0.getSeconds();
            },
            getMilliseconds: function() {
                return d3.getMilliseconds() - d0.getMilliseconds();
            },
            toString: function(){
                let h = this.getHours() < 10 ? "0" + this.getHours() : this.getHours();
                let m = this.getMinutes() < 10 ? "0" + this.getMinutes() : this.getMinutes();
                let s = this.getSeconds() < 10 ? "0" + this.getSeconds() : this.getSeconds();

                return h + ":" + m + ":" + s;
            },
        };
    }
}