var app = (function(){
    var datas = (function(){
        this.articles = [], this.comments = [];

        this.getAll = function(){

            for(var comment in weekcomment)
            {
                this.comments.push({x:weekcomment[comment].period, y:weekcomment[comment].number});
            }
            for(var article in weekArticle)
            {
                this.articles.push({x:weekArticle[article].period, y:weekArticle[article].number});
            }
            return [
                {values: this.articles, key:"Commentaires", area:true},
                {values: this.comments, key:"Articles"}
            ];
        };

        this.getMaxComment = function(){
            var topComments = [{value: 0, label:0}];
            for (var i = this.comments.length; i >= 1; i--) {
                var curr = this.comments[i-1];
                if(curr.y == topComments[0].value)
                {
                    topComments.push({value: curr.y, label: "S : "+i});
                }
                else if(curr.y > topComments[0].value)
                {
                    topComments = [];
                    topComments.push({value: curr.y, label: "S : "+i});
                }
            }

            return topComments;
        };

        this.getMaxPost = function(){
            var topPost = [{value: 0, label:0}];
            for (var i = this.articles.length; i >= 1; i--) {
                var curr = this.articles[i-1];
                if(curr.y == topPost[0].value)
                {
                    topPost.push({value: curr.y, label: "S : "+i});
                }
                else if(curr.y > topPost[0].value)
                {
                    topPost = [];
                    topPost.push({value: curr.y, label: "S : "+i});
                }
            }

            return topPost;
        };

        this.getMinComment = function(){
            var minComments = [];
            var maxComments = this.getMaxComment();
            minComments.push(maxComments[0]);
            for (var i = this.comments.length; i >= 1; i--) {
                var curr = this.comments[i-1];
                if(curr.y == minComments[0].value)
                {
                    minComments.push({value: curr.y, label: "S : "+i});
                }
                else if(curr.y < minComments[0].value)
                {
                    minComments = [];
                    minComments.push({value: curr.y, label: "S : "+i});
                }
            }

            return minComments;
        };

        this.getMinPost = function(){
            var minPost = [];
            var maxPost = this.getMaxPost();
            minPost.push(maxPost[0]);
            for (var i = this.articles.length; i >= 1; i--) {
                var curr = this.articles[i-1];
                if(curr.y == minPost[0].value)
                {
                    minPost.push({value: curr.y, label: "S : "+i});
                }
                else if(curr.y < minPost[0].value)
                {
                    minPost = [];
                    minPost.push({value: curr.y, label: "S : "+i});
                }
            }

            return minPost;
        };

        return this;
    })();

    return{
        getAll: datas.getAll(),
        getMaxPost : datas.getMaxPost(),
        getMaxComment : datas.getMaxComment(),
        getMinComment : datas.getMinComment(),
        getMinPost : datas.getMinPost(),
    };
    })();



function defaultLineConfig(containerid, data, guideline, auxOptions) {
if (auxOptions === undefined) auxOptions = {};
if (guideline === undefined) guideline = true;
nv.addGraph(function() {
    var chart;
    chart = nv.models.lineChart().useInteractiveGuideline(guideline);

    if (auxOptions.width)
      chart.width(auxOptions.width);

    if (auxOptions.height)
      chart.height(auxOptions.height);
    
    chart.xAxis
        .axisLabel('Semaines')
        .tickFormat(d3.format(',r'));

    chart.yAxis
        .axisLabel('Quantité')
        .tickFormat(d3.format('.02f'));

    d3.select('#' + containerid + ' svg')
        .datum(data)
      .transition().duration(500)
        .call(chart);

    nv.utils.windowResize(chart.update);

    return chart;
});
}

function DatasMax(){

var obj = [
    {
        key:"Max Posts",
        values:[]
    },
    {
        key:"Max Comments",
        values:[]
    },
    {
        key:"Min Posts",
        values:[]
    },
    {
        key:"Min Comments",
        values:[]
    }
];

obj[0].values = app.getMaxPost;
obj[1].values = app.getMaxComment;
obj[2].values = app.getMinPost;
obj[3].values = app.getMinComment;

return obj;
}

defaultLineConfig("chart-weeks", app.getAll);

nv.addGraph(function() {
    var chart;

    chart = nv.models.multiBarChart()
        .x(function(d) { return d.label })
        .y(function(d) { return d.value })
        .transitionDuration(300);

    chart.options({
        barColor: d3.scale.category20().range(),
        delay: 1200,
        groupSpacing: 0.1,
        reduceXTicks: false,
        staggerLabels: true
});

chart.multibar
    .hideable(true);

    d3.select('#chart-datas svg')
    .datum(DatasMax())
    .call(chart);

    nv.utils.windowResize(chart.update);

    chart.dispatch.on('stateChange', function(e) { nv.log('New State:', JSON.stringify(e)); });

    return chart;
});