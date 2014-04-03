(function(f, define){
    define([ "./kendo.core" ], f);
})(function(){

var __meta__ = {
    id: "dom",
    name: "Virtual DOM",
    category: "framework",
    depends: [ "core" ],
    hidden: true
};

(function(kendo) {
    var Node = function() {
        this.node = null;
    };

    Node.prototype = {
        remove: function() {
            this.node.parentNode.removeChild(this.node);
        }
    };

    var Element = function(nodeName, attr, children) {
        this.nodeName = nodeName;

        this.attr = attr || {};

        this.children = children || [];
    };

    Element.prototype = new Node();

    Element.prototype.create = function() {
        return document.createElement(this.nodeName);
    };

    Element.prototype.render = function(node, cached) {
        var index;
        var child;

        var children = this.children;

        var length = children.length;

        if (!cached) {
            cached = new Element();
        }

        for (index = 0; index < length; index++) {
            child = children[index];
            var cachedChild = cached.children[index];

            if (cachedChild && cachedChild.nodeName !== child.nodeName) {
                cachedChild.remove();
                cachedChild = null;
            }

            if (!cachedChild) {
                child.render(child.create(), null);
                node.appendChild(child.node);
            } else {
                child.render(cachedChild.node, cachedChild);
            }
        }

        for (index = length; index < cached.children.length; index++) {
            cached.children[index].remove();
        }

        var attr = this.attr;
        var attrName;

        for (attrName in attr) {
            if (!cached || attr[attrName] !== cached.attr[attrName]) {
                if (node[attrName] !== undefined) {
                    if (attrName !== "style") {
                        node[attrName] = attr[attrName];
                    } else {
                        var cssText = "";

                        var style = attr[attrName];

                        for (var key in style) {
                            cssText += key;
                            cssText += ": ";
                            cssText += style[key];
                            cssText += ";";
                        }

                        if (node.style.cssText !== cssText) {
                            node.style.cssText = cssText;
                        }
                    }
                } else {
                    node.setAttribute(attrName, attr[attrName]);
                }
            }
        }

        if (cached) {
            for (attrName in cached.attr) {
                if (attr[attrName] === undefined) {
                    if (node[attrName] !== undefined) {
                        if (attrName !== "style") {
                            node[attrName] = "";
                        } else {
                            node.style.cssText = "";
                        }
                    } else {
                        node.removeAttribute(attrName);
                    }
                }
            }
        }

        this.node = node;
    };

    var TextNode = function(nodeValue) {
        this.nodeValue = nodeValue;
    };

    TextNode.prototype = new Node();
    TextNode.prototype.nodeName = "#text";

    TextNode.prototype.create = function() {
        return document.createTextNode(this.nodeValue);
    };

    TextNode.prototype.render = function(node, cached) {
        if (!cached || cached.nodeName !== this.nodeName) {
            if (cached) {
                cached.node.parentNode.removeChild(cached.node);
            }
        } else {
            node = cached.node;

            if (this.nodeValue !== cached.nodeValue) {
                node.nodeValue = this.nodeValue;
            }
        }

        this.node = node;
    };

    var cache = {};
    var roots = [];

    function element(nodeName, attrs, children) {
        return new Element(nodeName, attrs, children);
    }

    function text(value) {
        return new TextNode(value);
    }

    function indexOf(array, item) {
        for (var index = 0, length = array.length; index < length; index++) {
            if (array[index] === item) {
                return index;
            }
        }

        return -1;
    }

    function render(root, node) {
        var id = indexOf(roots, root);

        if (id < 0) {
            id = roots.push(root) - 1;
        }

        node.render(root, cache[id]);

        cache[id] = node;
    }

    function remove(root) {
        var id = roots.indexOf(root);

        roots.splice(id, 1);

        delete(cache[id]);
    }

    kendo.dom = {
        element: element,
        text: text,
        render: render
    };
})(window.kendo);

return window.kendo;

}, typeof define == 'function' && define.amd ? define : function(_, f){ f(); });
