

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
        d3 = new Date(d2 - d1);
        d0 = new Date(0);
    
        return {
            getHours: function(){
                return d3.getHours() - d0.getHours();
            },
            getMinutes: function(){
                return d3.getMinutes() - d0.getMinutes();
            },
            getMilliseconds: function() {
                return d3.getMilliseconds() - d0.getMilliseconds();
            },
            toString: function(){
                return this.getHours() + ":" +
                       this.getMinutes() + ":" + 
                       this.getMilliseconds();
            },
        };
    }
}