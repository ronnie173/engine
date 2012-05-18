pc.extend(pc.resources, function () {
    var AnimationResourceHandler = function () {};

    AnimationResourceHandler = pc.inherits(AnimationResourceHandler, pc.resources.ResourceHandler);

    AnimationResourceHandler.prototype.load = function (identifier, success, error, progress, options) {
    	var url = identifier;
        var dir = pc.path.getDirectory(url);

        pc.net.http.get(url, function (response) {
            try {
                success(response);
            } catch (e) {
                error(pc.string.format("An error occured while loading animation from: '{0}'", url));
            }
        }.bind(this), {cache:false});
    };

    AnimationResourceHandler.prototype.open = function (data, options) {
        animation = this._loadAnimation(data);
    	return animation;
    };
	
    AnimationResourceHandler.prototype._loadAnimation = function (data) {
        var animData = data.animation;

        var anim = new pc.anim.Animation();
        anim.setName(animData.name);
        anim.setDuration(animData.duration);

        for (var i = 0; i < animData.nodes.length; i++) {
            var node = new pc.anim.Node();            

            var n = animData.nodes[i];
            node._name = n.name;

            for (var j = 0; j < n.keys.length; j++) {
                var key = new pc.anim.Key();

                var k = n.keys[j];
                var q = k.quat;
                var p = k.pos;
                var s = k.scale;
                var t = k.time;

                key._quat  = pc.math.quat.create(q[0], q[1], q[2], q[3]);
                key._pos   = pc.math.quat.create(p[0], p[1], p[2]);
                key._scale = pc.math.quat.create(s[0], s[1], s[2]);
                key._time  = t;

                node._keys.push(key);
            }

            anim.addNode(node);
        }

        return anim;
    };
	
    var AnimationRequest = function AnimationRequest(identifier) {};

    AnimationRequest = pc.inherits(AnimationRequest, pc.resources.ResourceRequest);
    AnimationRequest.prototype.type = "animation";
	
    return {
        AnimationResourceHandler: AnimationResourceHandler,
        AnimationRequest: AnimationRequest
    }	
}());
