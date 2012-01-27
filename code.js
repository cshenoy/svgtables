$(window).load(function(){
    var Shape = Backbone.Model.extend({
        defaults: { x:50, y:50, width:150, height:150, color:'black' },
        setTopLeft: function(x,y) { this.set({ x:x, y:y }); },
        setDim: function(w,h) { this.set({ width:w, height:h }); },
    });

    var ShapeView = Backbone.View.extend({ 
        initialize: function() {
            var r = Raphael("table");
            r.circle(150,150,108).attr({stroke: "#000", "stroke-width": 4, fill: "rgba(253,20,98,0.7)"});
            $('#table').mousemove(this, this.mousemove).mouseup(this, this.mouseup);
            this.model.bind('change', this.updateView, this);
            console.log("initializing");
        },
        render: function() {
            $('#table').append(this.el);
            $(this.el).html('<div class="shape"/>'
                      + '<div class="control delete hide"/>'
                      + '<div class="control change-color hide"/>'
                      + '<div class="control resize hide"/>')
                .css({ position: 'absolute', padding: '10px' });
            this.updateView();
            return this;
        },
        updateView: function() {
            $(this.el).css({
                left:       this.model.get('x'),
                top:        this.model.get('y'),
                width:      this.model.get('width') - 10,
                height:     this.model.get('height') - 10 });
            this.$('.shape').css({ background: this.model.get('color') });
        },
        events: {
            'mouseenter': 'hoveringStart',
            'mouseleave': 'hoveringEnd',
            'mousedown': 'draggingStart',
            'mousedown .resize': 'resizingStart',
            'mousedown .change-color': 'changeColor',
            'mousedown .delete': 'deleting',
        },
        hoveringStart: function () {
            this.$('.control').removeClass('hide');
            console.log('hoveringStart');
        },
        hoveringEnd: function () {
            this.$('.control').addClass('hide');
        },
        draggingStart: function (e) {
            this.dragging = true;
            this.initialX = e.pageX - this.model.get('x');
            this.initialY = e.pageY - this.model.get('y');
            return false; // prevents text selection
        },
        resizingStart: function() {
            this.resizing = true;
            return false;
        },
        changeColor: function() {
            this.model.set({ color: prompt('Enter color value', this.model.get('color')) });
        },
        deleting: function() {
            this.model.collection.remove(this.model);
        },
        mouseup: function (e) {
            if (!e.data) return;
            var self = e.data;
            self.dragging = self.resizing = false;
        },
        mousemove: function(e) {
            if (!e.data) return;
            var self = e.data;
            if (self.dragging) {
                self.model.setTopLeft(e.pageX - self.initialX, e.pageY - self.initialY);
            } else if (self.resizing) {
                self.model.setDim(e.pageX - self.model.get('x'), e.pageY - self.model.get('y'));
            }
        }
    });

    var Document = Backbone.Collection.extend({ model: Shape });

    var DocumentView =  Backbone.View.extend({
        id: 'table',
        views: {},
        initialize: function() {
            this.collection.bind('add', this.added, this);
            this.collection.bind('remove', this.removed, this);
        },
        render: function() {
            return this;
        },
        added: function(m) {
            this.views[m.cid] = new ShapeView({
                model: m, 
                id:'view_' + m.cid
            }).render();                                        
        },
        removed: function(m) {
            this.views[m.cid].remove();
            delete this.views[m.cid];
        }
    });

    var document = new Document();
    var documentView = new DocumentView({ collection: document });
    documentView.render();

    $('#new-shape').click(function() {
        document.add(new Shape());
    });


    //var table = Raphael("table");
    //table.circle(150,150,108).attr({stroke: "#000", "stroke-width": 4, fill: "rgba(231,254,98,0.6)"});
});