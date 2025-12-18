import React, { useEffect, useRef } from 'react';

export const ParticleHero: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let particlesArray: Particle[] = [];
        
        // Configuration
        const numberOfParticles = 100; // Increased count for better density
        const mouseRadius = 150;

        // Mouse State
        let mouse = {
            x: -1000,
            y: -1000,
            radius: mouseRadius
        };

        // Resize Canvas
        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            init();
        };

        // Track Mouse
        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        };

        const handleMouseLeave = () => {
            mouse.x = -1000;
            mouse.y = -1000;
        }

        // Particle Class
        class Particle {
            x: number;
            y: number;
            directionX: number;
            directionY: number;
            size: number;
            color: string;
            baseX: number;
            baseY: number;

            constructor() {
                this.x = Math.random() * canvas!.width;
                this.y = Math.random() * canvas!.height;
                // Random speed
                this.directionX = (Math.random() * 1) - 0.5;
                this.directionY = (Math.random() * 1) - 0.5;
                this.size = (Math.random() * 2) + 1;
                
                // Random galaxy colors
                const colors = ['#00f3ff', '#ff0099', '#ffffff', '#ffd700'];
                this.color = colors[Math.floor(Math.random() * colors.length)];
                
                this.baseX = this.x;
                this.baseY = this.y;
            }

            draw() {
                if (!ctx) return;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
                ctx.fillStyle = this.color;
                ctx.fill();
            }

            update() {
                // Bounce off edges
                if (this.x > canvas!.width || this.x < 0) {
                    this.directionX = -this.directionX;
                }
                if (this.y > canvas!.height || this.y < 0) {
                    this.directionY = -this.directionY;
                }

                // Mouse Repulsion Logic
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < mouse.radius) {
                    // Calculate angle and force
                    const angle = Math.atan2(dy, dx);
                    const force = (mouse.radius - distance) / mouse.radius;
                    const forceX = Math.cos(angle) * force * 5; // Strength multiplier
                    const forceY = Math.sin(angle) * force * 5;

                    this.x -= forceX;
                    this.y -= forceY;
                } 

                // Move particle naturally
                this.x += this.directionX;
                this.y += this.directionY;

                this.draw();
            }
        }

        function init() {
            particlesArray = [];
            for (let i = 0; i < numberOfParticles; i++) {
                particlesArray.push(new Particle());
            }
        }

        function connect() {
            let opacityValue = 1;
            for (let a = 0; a < particlesArray.length; a++) {
                for (let b = a; b < particlesArray.length; b++) {
                    let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x))
                        + ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
                    
                    // Connection distance threshold
                    if (distance < (canvas!.width / 7) * (canvas!.height / 7) && distance < 20000) {
                        opacityValue = 1 - (distance / 20000);
                        if (!ctx) return;
                        
                        ctx.strokeStyle = 'rgba(112, 0, 255,' + opacityValue + ')'; // Galaxy violet
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                        ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                        ctx.stroke();
                    }
                }
            }
        }

        function animate() {
            animationFrameId = requestAnimationFrame(animate);
            if (!ctx || !canvas) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            for (let i = 0; i < particlesArray.length; i++) {
                particlesArray[i].update();
            }
            connect();
        }

        // Initialize listeners
        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseout', handleMouseLeave);
        
        // Setup
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        init();
        animate();

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseout', handleMouseLeave);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas 
            ref={canvasRef} 
            className="absolute top-0 left-0 w-full h-full pointer-events-none z-0 mix-blend-screen opacity-60"
        />
    );
};