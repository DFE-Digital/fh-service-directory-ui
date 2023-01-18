// it doesn't make sense to do typescript type checking in a javascript file where you can't specify the type (is there a way?)
// (f is a HTMLScriptElement but we can't cast it in js)
// so switch off javascript compilation for this file...
// @ts-nocheck
export default function loadAnalytics() {
    // ga side: https://www.youtube.com/watch?v=28d60ejfk3s
    // should we set up consent?: https://developers.google.com/tag-platform/devguides/consent#tag-manager
    if (!window.dataLayer) {
        (function (w, d, s, l, i) {
            w[l] = w[l] || [];
            w[l].push({
                'gtm.start': new Date().getTime(), event: 'gtm.js'
            });
            var f = d.getElementsByTagName(s)[0], j = d.createElement(s), dl = l != 'dataLayer' ? '&l=' + l : '';
            j.async = true;
            j.src =
                'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
            f.parentNode.insertBefore(j, f);
        })(window, document, 'script', 'dataLayer', 'GTM-W6QMSGQ');
        // nonce enabled version (if we decide to enable nonces)
        //
        // see: https://dev.to/matijamrkaic/using-google-tag-manager-with-a-content-security-policy-9ai
        // <script id="gtmScript" data-nonce="@Context.GetNonce()" asp-add-nonce>
        //
        //    (function (w, d, s, l, i) {
        //        w[l] = w[l] || [];
        //        w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
        //        var f = d.getElementsByTagName(s)[0], j = d.createElement(s), dl = l != 'dataLayer' ? '&l=' + l : ''; j.async = true;
        //        j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl; var n = d.querySelector('[nonce]'); n && j.setAttribute('nonce', n.nonce || n.getAttribute('nonce'));
        //        f.parentNode.insertBefore(j, f);
        //    }
        //    )(window, document, 'script', 'dataLayer', 'GTM-W6QMSGQ');
    }
}

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvYW5hbHl0aWNzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLCtIQUErSDtBQUMvSCx3REFBd0Q7QUFDeEQsd0RBQXdEO0FBQ3hELGNBQWM7QUFFZCxNQUFNLENBQUMsT0FBTyxVQUFVLGFBQWE7SUFFakMsdURBQXVEO0lBQ3ZELHNHQUFzRztJQUV0RyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRTtRQUVuQixDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUM7WUFDcEIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7WUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO2dCQUN6QixXQUFXLEVBQ1AsSUFBSSxJQUFJLEVBQUUsQ0FBQyxPQUFPLEVBQUUsRUFBRSxLQUFLLEVBQUUsUUFBUTthQUM1QyxDQUFDLENBQUM7WUFBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ3BDLENBQUMsR0FBRyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLElBQUksV0FBVyxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7WUFBQyxDQUFDLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztZQUFDLENBQUMsQ0FBQyxHQUFHO2dCQUNyRiw2Q0FBNkMsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO1lBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ2hHLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLFdBQVcsRUFBRSxhQUFhLENBQUMsQ0FBQztRQUUvRCx3REFBd0Q7UUFDeEQsRUFBRTtRQUNGLCtGQUErRjtRQUMvRix5RUFBeUU7UUFDekUsRUFBRTtRQUNGLGlDQUFpQztRQUNqQyw0QkFBNEI7UUFDNUIsNEVBQTRFO1FBQzVFLCtIQUErSDtRQUMvSCwrS0FBK0s7UUFDL0ssMENBQTBDO1FBQzFDLE9BQU87UUFDUCxnRUFBZ0U7S0FDL0Q7QUFDTCxDQUFDIiwiZmlsZSI6ImNvbXBvbmVudHMvYW5hbHl0aWNzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXHJcbi8vIGl0IGRvZXNuJ3QgbWFrZSBzZW5zZSB0byBkbyB0eXBlc2NyaXB0IHR5cGUgY2hlY2tpbmcgaW4gYSBqYXZhc2NyaXB0IGZpbGUgd2hlcmUgeW91IGNhbid0IHNwZWNpZnkgdGhlIHR5cGUgKGlzIHRoZXJlIGEgd2F5PylcclxuLy8gKGYgaXMgYSBIVE1MU2NyaXB0RWxlbWVudCBidXQgd2UgY2FuJ3QgY2FzdCBpdCBpbiBqcylcclxuLy8gc28gc3dpdGNoIG9mZiBqYXZhc2NyaXB0IGNvbXBpbGF0aW9uIGZvciB0aGlzIGZpbGUuLi5cclxuLy8gQHRzLW5vY2hlY2tcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGxvYWRBbmFseXRpY3MoKSB7XHJcblxyXG4gICAgLy8gZ2Egc2lkZTogaHR0cHM6Ly93d3cueW91dHViZS5jb20vd2F0Y2g/dj0yOGQ2MGVqZmszc1xyXG4gICAgLy8gc2hvdWxkIHdlIHNldCB1cCBjb25zZW50PzogaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vdGFnLXBsYXRmb3JtL2Rldmd1aWRlcy9jb25zZW50I3RhZy1tYW5hZ2VyXHJcblxyXG4gICAgaWYgKCF3aW5kb3cuZGF0YUxheWVyKSB7XHJcblxyXG4gICAgICAgIChmdW5jdGlvbiAodywgZCwgcywgbCwgaSkge1xyXG4gICAgICAgICAgICB3W2xdID0gd1tsXSB8fCBbXTsgd1tsXS5wdXNoKHtcclxuICAgICAgICAgICAgICAgICdndG0uc3RhcnQnOlxyXG4gICAgICAgICAgICAgICAgICAgIG5ldyBEYXRlKCkuZ2V0VGltZSgpLCBldmVudDogJ2d0bS5qcydcclxuICAgICAgICAgICAgfSk7IHZhciBmID0gZC5nZXRFbGVtZW50c0J5VGFnTmFtZShzKVswXSxcclxuICAgICAgICAgICAgICAgIGogPSBkLmNyZWF0ZUVsZW1lbnQocyksIGRsID0gbCAhPSAnZGF0YUxheWVyJyA/ICcmbD0nICsgbCA6ICcnOyBqLmFzeW5jID0gdHJ1ZTsgai5zcmMgPVxyXG4gICAgICAgICAgICAgICAgJ2h0dHBzOi8vd3d3Lmdvb2dsZXRhZ21hbmFnZXIuY29tL2d0bS5qcz9pZD0nICsgaSArIGRsOyBmLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGosIGYpO1xyXG4gICAgICAgIH0pKHdpbmRvdywgZG9jdW1lbnQsICdzY3JpcHQnLCAnZGF0YUxheWVyJywgJ0dUTS1XNlFNU0dRJyk7XHJcblxyXG4gICAgLy8gbm9uY2UgZW5hYmxlZCB2ZXJzaW9uIChpZiB3ZSBkZWNpZGUgdG8gZW5hYmxlIG5vbmNlcylcclxuICAgIC8vXHJcbiAgICAvLyBzZWU6IGh0dHBzOi8vZGV2LnRvL21hdGlqYW1ya2FpYy91c2luZy1nb29nbGUtdGFnLW1hbmFnZXItd2l0aC1hLWNvbnRlbnQtc2VjdXJpdHktcG9saWN5LTlhaVxyXG4gICAgLy8gPHNjcmlwdCBpZD1cImd0bVNjcmlwdFwiIGRhdGEtbm9uY2U9XCJAQ29udGV4dC5HZXROb25jZSgpXCIgYXNwLWFkZC1ub25jZT5cclxuICAgIC8vXHJcbiAgICAvLyAgICAoZnVuY3Rpb24gKHcsIGQsIHMsIGwsIGkpIHtcclxuICAgIC8vICAgICAgICB3W2xdID0gd1tsXSB8fCBbXTtcclxuICAgIC8vICAgICAgICB3W2xdLnB1c2goeyAnZ3RtLnN0YXJ0JzogbmV3IERhdGUoKS5nZXRUaW1lKCksIGV2ZW50OiAnZ3RtLmpzJyB9KTtcclxuICAgIC8vICAgICAgICB2YXIgZiA9IGQuZ2V0RWxlbWVudHNCeVRhZ05hbWUocylbMF0sIGogPSBkLmNyZWF0ZUVsZW1lbnQocyksIGRsID0gbCAhPSAnZGF0YUxheWVyJyA/ICcmbD0nICsgbCA6ICcnOyBqLmFzeW5jID0gdHJ1ZTtcclxuICAgIC8vICAgICAgICBqLnNyYyA9ICdodHRwczovL3d3dy5nb29nbGV0YWdtYW5hZ2VyLmNvbS9ndG0uanM/aWQ9JyArIGkgKyBkbDsgdmFyIG4gPSBkLnF1ZXJ5U2VsZWN0b3IoJ1tub25jZV0nKTsgbiAmJiBqLnNldEF0dHJpYnV0ZSgnbm9uY2UnLCBuLm5vbmNlIHx8IG4uZ2V0QXR0cmlidXRlKCdub25jZScpKTtcclxuICAgIC8vICAgICAgICBmLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGosIGYpO1xyXG4gICAgLy8gICAgfVxyXG4gICAgLy8gICAgKSh3aW5kb3csIGRvY3VtZW50LCAnc2NyaXB0JywgJ2RhdGFMYXllcicsICdHVE0tVzZRTVNHUScpO1xyXG4gICAgfVxyXG59Il19
