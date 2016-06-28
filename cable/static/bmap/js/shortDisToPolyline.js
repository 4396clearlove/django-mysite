_getProximity: function(cr) {
        var cf, ch, cs, ck, cj, cq, cp, co = [];
        var cw = this.map.pointToOverlayPixel(cr);
        co = this._getDisplayPixels(this.points)[0];
        var cz = co.length;
        if (cz > 1) {
            for (var cx = 1; cx < cz; cx++) {
                var cm = co[cx - 1];
                var cD = co[cx];
                if (!cm || !cD) {
                    continue
                }
                if (cm.x != cD.x) {
                    var cC = (cD.y - cm.y) / (cD.x - cm.x);
                    var cA = cD.y - cC * cD.x;
                    cp = Math.abs(cC * cw.x + cA - cw.y) / Math.sqrt(cC * cC + 1)
                } else {
                    cp = Math.abs(cw.x - cD.x)
                }
                var cy = Math.pow(cD.y - cm.y, 2) + Math.pow(cD.x - cm.x, 2);
                var cg = Math.pow(cD.y - cw.y, 2) + Math.pow(cD.x - cw.x, 2);
                var cB = Math.pow(cm.y - cw.y, 2) + Math.pow(cm.x - cw.x, 2);
                var ci = Math.pow(cp, 2);
                var e = cg - ci + cB - ci;
                if (e > cy) {
                    cp = Math.sqrt(Math.min(cg, cB))
                }
                if ((cf == null ) || (cf > cp)) {
                    ch = Math.sqrt(cB - ci) / Math.sqrt(cy);
                    cs = Math.sqrt(cg - ci) / Math.sqrt(cy);
                    cf = cp;
                    cq = cx
                }
                cf = Math.min(cf, cp)
            }
            if (this.toString() != "Polyline") {
                var cu = 0
                  , ct = 0
                  , cv = this.points;
                for (var cx = 0; cx < cz; cx++) {
                    cu = (cx == cz - 1) ? 0 : cu + 1;
                    if ((cv[cx].lat != cv[cu].lat) && (((cr.lat >= cv[cx].lat) && (cr.lat < cv[cu].lat)) || ((cr.lat >= cv[cu].lat) && (cr.lat < cv[cx].lat))) && (cr.lng < (cv[cu].lng - cv[cx].lng) * (cr.lat - cv[cx].lat) / (cv[cu].lat - cv[cx].lat) + cv[cx].lng)) {
                        ct++
                    }
                }
                cf = Math.min(cf, ct % 2 > 0 ? 0 : cf)
            }
            if (ch > 1) {
                ch = 1
            }
            if (cs > 1) {
                ch = 0;
                cs = 1
            }
            var cn = co[cq - 1].x - co[cq].x;
            var cl = co[cq - 1].y - co[cq].y;
            ck = co[cq - 1].x - (cn * ch);
            cj = co[cq - 1].y - (cl * ch)
        }
        return {
            pixel: new a2(ck,cj),
            dist: cf
        }
    },


/**
 * [getProximity description]
 * @param  {[type]} point    [需要计算的Point]
 * @param  {[type]} polyline [需要计算的Polyline]
 * @return {[type]}          [description]
 */
function getProximity(point, polyline) {
    var high, dist, k1, k2, index, returnX, returnY;

    var pixel = map.pointToOverlayPixel(point);
    var polylinePixelList = getPixel(polyline);
    for(var i = 1; i<polylinePixelList.length; i++){
        var curPixel = polylinePixelList[i-1];
        var nextPixel = polylinePixelList[i];
        if(curPixel.x != nextPixel.x){
            var k = (nextPixel.y - curPixel.y) / (nextPixel.x - curPixel.x );
            var unknown = nextPixel.y - k*nextPixel.x;  //不知道为什么这么求高??
            high = Math.abs(k*pixel.x+unknown-pixel.y)/Math.sqrt(k*k+1);    //不知道为什么这么求高??
        } else {
            high = Math.abs(pixel.x - nextPixel.x);
        }
        var curNextDis2 = Math.pow(nextPixel.y - curPixel.y, 2) + Math.pow(nextPixel.x - curPixel.x, 2);  //三条边长的平方 
        var nextGivenDist2 = Math.pow(nextPixel.y - pixel.y, 2) + Math.pow(nextPixel.x - pixel.x, 2);
        var curGivenDist2 = Math.pow(curPixel.y - pixel.y, 2) + Math.pow(curPixel.x - pixel.x, 2);
        var high2 = Math.pow(high, 2); //高的平方
        var e = nextGivenDist2 - high2 + curGivenDist2 - high2;  //勾股定理
        if(e > curNextDis2) { //说明高在三角形以外
            high = Math.sqrt(Math.min(nextGivenDist2, curGivenDist2));  //这时不计算高，而是取Given节点到Cur与Next节点的最短边
        }
        if ((dist == null) || (dist > high)) {
            k1 = Math.sqrt(nextGivenDist2-high2) / Math.sqrt(curNextDis2);
            k2 = Math.sqrt(curGivenDist2-high2) / Math.sqrt(curNextDis2);
            dist = high;
            index = i;
        }
        dist = Math.min(dist, high); //得最短距离


        if (k1 > 1) {
            k1 = 1
        }
        if (k2 > 1) {
            k1 = 0;
            k2 = 1
        }
        var betweenx = polylinePixelList[index - 1].x - polylinePixelList[index].x;
        var betweeny = polylinePixelList[index - 1].y - polylinePixelList[index].y;
        returnX = polylinePixelList[index - 1].x - (betweenx * k1);
        returnY = polylinePixelList[index - 1].y - (betweeny * k1)
    }
    return {
        pixel: new BMap.pixel(returnX,returnY),
        dist: dist
    }
}





        var cf, ch, cs, ck, cj, cq, cp, co = [];
        var cw = this.map.pointToOverlayPixel(cr);
        co = this._getDisplayPixels(this.points)[0];
        var cz = co.length;
        if (cz > 1) {
            for (var cx = 1; cx < cz; cx++) {
                var cm = co[cx - 1];
                var cD = co[cx];
                if (!cm || !cD) {
                    continue
                }
                if (cm.x != cD.x) {
                    var cC = (cD.y - cm.y) / (cD.x - cm.x);
                    var cA = cD.y - cC * cD.x;
                    cp = Math.abs(cC * cw.x + cA - cw.y) / Math.sqrt(cC * cC + 1)
                } else {
                    cp = Math.abs(cw.x - cD.x)
                }
                var cy = Math.pow(cD.y - cm.y, 2) + Math.pow(cD.x - cm.x, 2);
                var cg = Math.pow(cD.y - cw.y, 2) + Math.pow(cD.x - cw.x, 2);
                var cB = Math.pow(cm.y - cw.y, 2) + Math.pow(cm.x - cw.x, 2);
                var ci = Math.pow(cp, 2);
                var e = cg - ci + cB - ci;
                if (e > cy) {
                    cp = Math.sqrt(Math.min(cg, cB))
                }
                if ((cf == null ) || (cf > cp)) {
                    ch = Math.sqrt(cB - ci) / Math.sqrt(cy);
                    cs = Math.sqrt(cg - ci) / Math.sqrt(cy);
                    cf = cp;
                    cq = cx
                }
                cf = Math.min(cf, cp)
            }
            if (this.toString() != "Polyline") {
                var cu = 0
                  , ct = 0
                  , cv = this.points;
                for (var cx = 0; cx < cz; cx++) {
                    cu = (cx == cz - 1) ? 0 : cu + 1;
                    if ((cv[cx].lat != cv[cu].lat) && (((cr.lat >= cv[cx].lat) && (cr.lat < cv[cu].lat)) || ((cr.lat >= cv[cu].lat) && (cr.lat < cv[cx].lat))) && (cr.lng < (cv[cu].lng - cv[cx].lng) * (cr.lat - cv[cx].lat) / (cv[cu].lat - cv[cx].lat) + cv[cx].lng)) {
                        ct++
                    }
                }
                cf = Math.min(cf, ct % 2 > 0 ? 0 : cf)
            }
            if (ch > 1) {
                ch = 1
            }
            if (cs > 1) {
                ch = 0;
                cs = 1
            }
            var cn = co[cq - 1].x - co[cq].x;
            var cl = co[cq - 1].y - co[cq].y;
            ck = co[cq - 1].x - (cn * ch);
            cj = co[cq - 1].y - (cl * ch)
        }
        return {
            pixel: new a2(ck,cj),
            dist: cf
        }
    },


_getDisplayPixels: function(cr) {
        var cw = this.map;
        var ch = [];
        if (cr.length === 0 || !this.domElement || !this.isVisible()) {
            return [ch]
        }
        if (!((s.Platform.ipad || s.Platform.iphone || s.Platform.android) && cr.length > 5000) && !this._config.enableEditing) {
            var ci = this.getParseCacheIndex(cw.getZoom());
            if (this._parseCache[ci]) {
                cr = this._parseCache[ci]
            } else {
                var e = bF(cr, this.getParseTolerance(cw.getZoom(), cw.config.coordType));
                cr = this._parseCache[ci] = e
            }
        }
        var cv;
        var cx = cw.pointToOverlayPixel(cr[0]);
        ch.push(cx);
        if (cx.onBack) {
            cv = true
        }
        for (var cs = 1, cp = 1, co = cr.length; cs < co; cs++) {
            var cg = cw.pointToOverlayPixel(cr[cs]);
            if (cg.onBack) {
                cv = true
            }
            if (!cg.equals(ch[cp - 1])) {
                ch.push(cg);
                cp++
            }
        }
        var cu = [];
        var cm = cw.offsetX;
        var cl = cw.offsetY;
        var ck = cw.config.drawMargin;
        var cj = {
            minX: -cm - ck,
            minY: -cl - ck,
            maxX: -cm + ck + cw.width,
            maxY: -cl + ck + cw.height
        };
        for (cs = 0,
        co = ch.length - 1; cs < co; cs++) {
            var ct = ch[cs];
            var cq = ch[cs + 1];
            var cf = a0(ct, cq, cj);
            if (cf) {
                cu.push(cf)
            }
        }
        var cn = [[]];
        for (cs = 0,
        co = cu.length; cs < co; cs++) {
            if (cu[cs].clip) {
                cn[cn.length - 1].push(cu[cs].pixel0);
                cn[cn.length - 1].push(cu[cs].pixel1);
                if (cu[cs + 1] && cu[cs + 1].clip) {
                    cn.push([])
                }
            } else {
                cn[cn.length - 1].push(cu[cs].pixel0);
                if (cs === cu.length - 1) {
                    cn[cn.length - 1].push(cu[cs].pixel1)
                }
            }
        }
        cn.isOnBack = cv;
        return cn
    }