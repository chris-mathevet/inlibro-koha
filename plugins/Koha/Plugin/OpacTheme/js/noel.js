document.addEventListener('DOMContentLoaded', function() {
    // 1. Injecter le <ul class="lightrope"> dans la div collapse navbar-collapse
    var navbarCollapse = document.querySelector('footer#changelanguage .collapse.navbar-collapse');
    if (navbarCollapse) {
        var container = document.createElement('div');
        container.className = 'lightcontainer';

        var ul = document.createElement('ul');
        ul.className = 'lightrope';
        ul.innerHTML = `
            <li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li>
            <li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li>
            <li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li>
        `;

        container.appendChild(ul);
        navbarCollapse.appendChild(container);
    }

    // 2. Script des flocons de neige (Snowflake)
    var Snowflake = (function() {
        var flakes;
        var flakesTotal = 250;
        var wind = 0;
        var mouseX = 0;
        var mouseY = 0;

        function Snowflake(size, x, y, vx, vy) {
            this.size = size;
            this.x = x;
            this.y = y;
            this.vx = vx;
            this.vy = vy;
            this.hit = false;
            this.melt = false;
            this.div = document.createElement('div');
            this.div.classList.add('snowflake');
            this.div.style.width = this.size + 'px';
            this.div.style.height = this.size + 'px';
            this.div.style.position = 'fixed';
            this.div.style.top = '0';
            this.div.style.left = '0';
            this.div.style.pointerEvents = 'none';
            this.div.style.zIndex = '9999';
            this.div.style.background = 'white'; // tu peux personnaliser le style ici
            this.div.style.borderRadius = '50%';
            this.div.style.opacity = '0.8';
        }

        Snowflake.prototype.move = function() {
            if (this.hit) {
                if (Math.random() > 0.995) this.melt = true;
            } else {
                this.x += this.vx + Math.min(Math.max(wind, -10), 10);
                this.y += this.vy;
            }
            if (this.x > window.innerWidth) {
                this.x = 0;
            }
            if (this.x < 0) {
                this.x = window.innerWidth;
            }

            if (this.y > window.innerHeight + this.size) {
                this.x = Math.random() * window.innerWidth;
                this.y = -this.size;
                this.melt = false;
            }
            var dx = mouseX - this.x;
            var dy = mouseY - this.y;
            this.hit = !this.melt && this.y < mouseY && dx * dx + dy * dy < 2400;
        };

        Snowflake.prototype.draw = function() {
            this.div.style.transform =
            this.div.style.MozTransform =
            this.div.style.webkitTransform =
                'translate3d(' + this.x + 'px,' + this.y + 'px,0)';
        };

        function update() {
            for (var i = flakes.length; i--;) {
                var flake = flakes[i];
                flake.move();
                flake.draw();
            }
            requestAnimationFrame(update);
        }

        Snowflake.init = function(container) {
            flakes = [];
            for (var i = flakesTotal; i--;) {
                var size = (Math.random() + 0.2) * 12 + 1;
                var flake = new Snowflake(
                    size,
                    Math.random() * window.innerWidth,
                    Math.random() * window.innerHeight,
                    Math.random() - 0.5,
                    size * 0.1
                );
                container.appendChild(flake.div);
                flakes.push(flake);
            }
            window.ondeviceorientation = function(event) {
                if (event) {
                    wind = event.gamma / 10;
                }
            };
            update();
        };

        return Snowflake;
    }());

    // Initialisation des flocons sur le body au chargement complet
    Snowflake.init(document.body);
});
