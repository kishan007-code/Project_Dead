import { useEffect, useRef } from "react";
import "./Footer.css";

function Footer() {
    const footerRef = useRef(null);

    const heartRef = useRef(null);

    const wakeOuterRef = useRef(null);
    const wakeMiddleRef = useRef(null);
    const wakeInnerRef = useRef(null);

    const shimmerRef = useRef(null);

    // NEW: liquid surface canvas
    const liquidCanvasRef = useRef(null);

    useEffect(() => {
        const footer = footerRef.current;
        const heart = heartRef.current;

        const wakeOuter = wakeOuterRef.current;
        const wakeMiddle = wakeMiddleRef.current;
        const wakeInner = wakeInnerRef.current;

        const shimmer = shimmerRef.current;
        const canvas = liquidCanvasRef.current;

        if (
            !footer ||
            !heart ||
            !wakeOuter ||
            !wakeMiddle ||
            !wakeInner ||
            !shimmer ||
            !canvas
        ) {
            return;
        }

        /*
         * ======================================================
         * DESKTOP / FINE POINTER ONLY
         * ======================================================
         */

        const hoverMedia = window.matchMedia(
            "(hover: hover) and (pointer: fine)"
        );

        if (!hoverMedia.matches) {
            return;
        }

        /*
         * ======================================================
         * CANVAS SETUP
         * ======================================================
         */

        const ctx = canvas.getContext("2d");

        if (!ctx) {
            return;
        }

        let animationFrame;

        let active = false;

        let mouseX = 0;
        let mouseY = 0;

        let heartX = 0;
        let heartY = 0;

        let velocityX = 0;
        let velocityY = 0;

        let previousTime = performance.now();

        /*
         * ======================================================
         * CANVAS SIZE
         * ======================================================
         */

        let width = 0;
        let height = 0;
        let dpr = 1;

        const resizeCanvas = () => {
            const rect =
                footer.getBoundingClientRect();

            width = rect.width;
            height = rect.height;

            /*
             * Cap DPR so a 4K display doesn't create
             * a ridiculous amount of canvas work.
             */
            dpr = Math.min(
                window.devicePixelRatio || 1,
                2
            );

            canvas.width =
                Math.floor(width * dpr);

            canvas.height =
                Math.floor(height * dpr);

            canvas.style.width =
                `${width}px`;

            canvas.style.height =
                `${height}px`;

            ctx.setTransform(
                dpr,
                0,
                0,
                dpr,
                0,
                0
            );
        };

        resizeCanvas();

        const resizeObserver =
            new ResizeObserver(
                resizeCanvas
            );

        resizeObserver.observe(footer);

        /*
         * ======================================================
         * RIPPLE DATA
         * ======================================================
         */

        const ripples = [];

        const MAX_RIPPLES = 70;

        /*
         * Time since last pointer movement.
         */
        let lastPointerMove =
            performance.now();

        /*
         * Time of last automatic stationary ripple.
         */
        let lastIdleRipple =
            performance.now();

        /*
         * ======================================================
         * UTILITIES
         * ======================================================
         */

        const clamp = (
            value,
            min,
            max
        ) =>
            Math.min(
                Math.max(value, min),
                max
            );

        const lerp = (
            a,
            b,
            amount
        ) =>
            a +
            (b - a) *
            amount;

        const getPosition = (event) => {
            const rect =
                footer.getBoundingClientRect();

            return {
                x:
                    event.clientX -
                    rect.left,

                y:
                    event.clientY -
                    rect.top,
            };
        };

        /*
         * ======================================================
         * CREATE RIPPLE
         * ======================================================
         */

        const createRipple = ({
            x,
            y,
            velocityX = 0,
            velocityY = 0,
            strength = 1,
            idle = false,
        }) => {
            if (
                ripples.length >=
                MAX_RIPPLES
            ) {
                ripples.shift();
            }

            const speed =
                Math.sqrt(
                    velocityX *
                        velocityX +
                    velocityY *
                        velocityY
                );

            /*
             * Moving pointer:
             * stretched ellipse.
             *
             * Stationary pointer:
             * almost radial.
             */

            let angle =
                Math.atan2(
                    velocityY,
                    velocityX
                );

            /*
             * A ripple aligned with travel direction.
             */
            const stretch =
                idle
                    ? 1
                    : clamp(
                        1 +
                            speed *
                                0.055,
                        1,
                        2.8
                    );

            ripples.push({
                x,
                y,

                radius: idle
                    ? 5
                    : 3,

                maxRadius:
                    idle
                        ? 95
                        : 125,

                alpha:
                    idle
                        ? 0.22
                        : 0.16,

                strength,

                angle,

                stretch,

                age: 0,

                /*
                 * Slightly different speed for
                 * every ripple = less mechanical.
                 */
                growth:
                    idle
                        ? 0.7
                        : 0.85 +
                          Math.random() *
                              0.35,

                life:
                    idle
                        ? 1.15
                        : 0.9 +
                          Math.random() *
                              0.4,
            });
        };

        /*
         * ======================================================
         * POINTER ENTER
         * ======================================================
         */

        const handlePointerEnter = (
            event
        ) => {
            const position =
                getPosition(event);

            mouseX =
                position.x;

            mouseY =
                position.y;

            heartX =
                mouseX;

            heartY =
                mouseY;

            velocityX = 0;
            velocityY = 0;

            points.length = 0;

            points.push({
                x: mouseX,
                y: mouseY,
            });

            active = true;

            footer.classList.add(
                "footer--active"
            );

            shimmer.style.setProperty(
                "--mx",
                `${mouseX}px`
            );

            shimmer.style.setProperty(
                "--my",
                `${mouseY}px`
            );

            /*
             * FIRST LIQUID TOUCH
             */
            createRipple({
                x: mouseX,
                y: mouseY,
                strength: 1.25,
                idle: true,
            });

            lastPointerMove =
                performance.now();

            lastIdleRipple =
                performance.now();
        };

        /*
         * ======================================================
         * POINTER MOVE
         * ======================================================
         */

        const handlePointerMove = (
            event
        ) => {
            if (!active) return;

            const position =
                getPosition(event);

            const previousX =
                mouseX;

            const previousY =
                mouseY;

            mouseX =
                position.x;

            mouseY =
                position.y;

            const moveX =
                mouseX - previousX;

            const moveY =
                mouseY - previousY;

            const movement =
                Math.sqrt(
                    moveX *
                        moveX +
                    moveY *
                        moveY
                );

            /*
             * Heart wake history.
             */

            const last =
                points[
                    points.length - 1
                ];

            if (last) {
                const dx =
                    mouseX - last.x;

                const dy =
                    mouseY - last.y;

                const distance =
                    Math.sqrt(
                        dx * dx +
                        dy * dy
                    );

                if (distance > 4) {
                    points.push({
                        x: mouseX,
                        y: mouseY,
                    });
                }

                if (
                    points.length >
                    MAX_POINTS
                ) {
                    points.shift();
                }
            }

            /*
             * Shimmer movement.
             */

            shimmer.style.setProperty(
                "--mx",
                `${mouseX}px`
            );

            shimmer.style.setProperty(
                "--my",
                `${mouseY}px`
            );

            /*
             * --------------------------------------------------
             * LIQUID DISTURBANCE
             * --------------------------------------------------
             *
             * While dragging the pointer, create smaller,
             * overlapping disturbances.
             */

            const now =
                performance.now();

            if (
                movement > 3 &&
                now -
                    lastPointerMove >
                    75
            ) {
                createRipple({
                    x: mouseX,
                    y: mouseY,

                    velocityX:
                        moveX,

                    velocityY:
                        moveY,

                    strength:
                        clamp(
                            movement /
                                9,
                            0.5,
                            1.5
                        ),

                    idle: false,
                });

                lastPointerMove =
                    now;
            }
        };

        /*
         * ======================================================
         * POINTER LEAVE
         * ======================================================
         */

        const handlePointerLeave = () => {
            active = false;

            footer.classList.remove(
                "footer--active"
            );
        };

        /*
         * ======================================================
         * HEART PATH
         * ======================================================
         */

        const points = [];

        const MAX_POINTS = 24;

        const buildPath = (
            startIndex = 0,
            endIndex = points.length
        ) => {
            if (
                points.length < 2 ||
                startIndex >=
                    endIndex - 1
            ) {
                return "";
            }

            const first =
                points[startIndex];

            let path =
                `M ${first.x} ${first.y}`;

            for (
                let i =
                    startIndex + 1;
                i < endIndex;
                i++
            ) {
                const previous =
                    points[i - 1];

                const current =
                    points[i];

                const midpointX =
                    (previous.x +
                        current.x) /
                    2;

                const midpointY =
                    (previous.y +
                        current.y) /
                    2;

                path +=
                    ` Q ${previous.x} ${previous.y} ` +
                    `${midpointX} ${midpointY}`;
            }

            return path;
        };

        /*
         * ======================================================
         * DRAW LIQUID
         * ======================================================
         */

        const drawRipples = () => {
            if (
                ripples.length === 0
            ) {
                return;
            }

            ctx.save();

            /*
             * "screen" makes overlapping white ripples
             * blend naturally instead of becoming muddy.
             */
            ctx.globalCompositeOperation =
                "screen";

            ripples.forEach(
                (ripple) => {
                    /*
                     * Fade curve.
                     */
                    const life =
                        clamp(
                            ripple.age /
                                ripple.life,
                            0,
                            1
                        );

                    const fade =
                        1 -
                        life;

                    /*
                     * Grow.
                     */
                    ripple.radius +=
                        ripple.growth;

                    ripple.age +=
                        0.016;

                    if (
                        ripple.radius >
                        ripple.maxRadius
                    ) {
                        ripple.age =
                            ripple.life;
                    }

                    if (
                        ripple.age >
                        ripple.life
                    ) {
                        return;
                    }

                    /*
                     * The ripple becomes longer in
                     * the direction of travel.
                     */
                    const scaleX =
                        ripple.stretch;

                    const scaleY =
                        1;

                    ctx.save();

                    ctx.translate(
                        ripple.x,
                        ripple.y
                    );

                    ctx.rotate(
                        ripple.angle
                    );

                    ctx.scale(
                        scaleX,
                        scaleY
                    );

                    /*
                     * ------------------------------
                     * OUTER SOFT BODY
                     * ------------------------------
                     */

                    ctx.beginPath();

                    ctx.ellipse(
                        0,
                        0,

                        ripple.radius,

                        ripple.radius *
                            0.42,

                        0,
                        0,
                        Math.PI * 2
                    );

                    ctx.strokeStyle =
                        `rgba(
                            255,
                            255,
                            255,
                            ${
                                ripple.alpha *
                                fade *
                                0.18
                            }
                        )`;

                    ctx.lineWidth =
                        7 *
                        ripple.strength *
                        fade;

                    ctx.shadowColor =
                        `rgba(
                            255,
                            255,
                            255,
                            ${
                                ripple.alpha *
                                fade *
                                0.25
                            }
                        )`;

                    ctx.shadowBlur =
                        16;

                    ctx.stroke();

                    /*
                     * ------------------------------
                     * MIDDLE RIPPLE
                     * ------------------------------
                     */

                    ctx.beginPath();

                    ctx.ellipse(
                        0,
                        0,

                        ripple.radius *
                            0.82,

                        ripple.radius *
                            0.27,

                        0,
                        0,
                        Math.PI * 2
                    );

                    ctx.strokeStyle =
                        `rgba(
                            255,
                            255,
                            255,
                            ${
                                ripple.alpha *
                                fade *
                                0.42
                            }
                        )`;

                    ctx.lineWidth =
                        2.5 *
                        ripple.strength *
                        fade;

                    ctx.shadowBlur =
                        6;

                    ctx.stroke();

                    /*
                     * ------------------------------
                     * BREAK THE PERFECT CIRCLE
                     * ------------------------------
                     *
                     * Small asymmetry makes this look
                     * like disturbed liquid rather than
                     * a CSS animation.
                     */

                    ctx.beginPath();

                    ctx.arc(
                        ripple.radius *
                            0.42,
                        0,

                        ripple.radius *
                            0.24,

                        Math.PI *
                            0.12,

                        Math.PI *
                            1.08
                    );

                    ctx.strokeStyle =
                        `rgba(
                            255,
                            255,
                            255,
                            ${
                                ripple.alpha *
                                fade *
                                0.28
                            }
                        )`;

                    ctx.lineWidth =
                        1.2 *
                        fade;

                    ctx.stroke();

                    ctx.restore();
                }
            );

            ctx.restore();
        };

        /*
         * ======================================================
         * PARTICLE-LIKE LIQUID DUST
         * ======================================================
         */

        const drawSurfaceGlow = (
            speed
        ) => {
            if (
                !active &&
                ripples.length === 0
            ) {
                return;
            }

            const intensity =
                clamp(
                    speed / 18,
                    0,
                    1
                );

            const gradient =
                ctx.createRadialGradient(
                    mouseX,
                    mouseY,
                    0,
                    mouseX,
                    mouseY,
                    170
                );

            gradient.addColorStop(
                0,
                `rgba(
                    255,
                    255,
                    255,
                    ${
                        0.012 +
                        intensity *
                            0.028
                    }
                )`
            );

            gradient.addColorStop(
                0.4,
                `rgba(
                    255,
                    255,
                    255,
                    ${
                        0.006 +
                        intensity *
                            0.012
                    }
                )`
            );

            gradient.addColorStop(
                1,
                "rgba(255,255,255,0)"
            );

            ctx.save();

            ctx.fillStyle =
                gradient;

            ctx.fillRect(
                0,
                0,
                width,
                height
            );

            ctx.restore();
        };

        /*
         * ======================================================
         * MAIN LOOP
         * ======================================================
         */

        const animate = (
            currentTime
        ) => {
            const delta =
                Math.min(
                    (
                        currentTime -
                        previousTime
                    ) /
                        1000,
                    0.05
                );

            previousTime =
                currentTime;

            /*
             * --------------------------------------------------
             * HEART PHYSICS
             * --------------------------------------------------
             */

            const dx =
                mouseX - heartX;

            const dy =
                mouseY - heartY;

            velocityX +=
                dx * 0.045;

            velocityY +=
                dy * 0.045;

            velocityX *=
                0.82;

            velocityY *=
                0.82;

            heartX +=
                velocityX;

            heartY +=
                velocityY;

            const speed =
                Math.sqrt(
                    velocityX *
                        velocityX +
                    velocityY *
                        velocityY
                );

            /*
             * Heart rotation.
             */

            const angle =
                Math.atan2(
                    velocityY,
                    velocityX
                );

            const tilt =
                clamp(
                    angle * 0.28,
                    -0.3,
                    0.3
                );

            /*
             * Heart breathing.
             */

            const pulse =
                1 +
                Math.min(
                    speed * 0.008,
                    0.035
                );

            heart.style.transform =
                `translate3d(
                    ${heartX}px,
                    ${heartY}px,
                    0
                )
                rotate(${tilt}rad)
                scale(${pulse})`;

            /*
             * --------------------------------------------------
             * SVG WAKE
             * --------------------------------------------------
             */

            if (
                points.length > 1
            ) {
                wakeOuter.setAttribute(
                    "d",
                    buildPath(
                        0,
                        points.length
                    )
                );

                wakeMiddle.setAttribute(
                    "d",
                    buildPath(
                        Math.max(
                            0,
                            points.length -
                                17
                        ),
                        points.length
                    )
                );

                wakeInner.setAttribute(
                    "d",
                    buildPath(
                        Math.max(
                            0,
                            points.length -
                                9
                        ),
                        points.length
                    )
                );
            }

            /*
             * --------------------------------------------------
             * IDLE RIPPLE
             * --------------------------------------------------
             *
             * A stationary cursor should still feel like it
             * touched the water once rather than producing
             * infinite rapid rings.
             */

            if (
                active &&
                currentTime -
                    lastPointerMove >
                    520 &&
                currentTime -
                    lastIdleRipple >
                    900
            ) {
                createRipple({
                    x: mouseX,
                    y: mouseY,

                    strength: 0.85,

                    idle: true,
                });

                lastIdleRipple =
                    currentTime;
            }

            /*
             * --------------------------------------------------
             * FADE RIPPLE ARRAY
             * --------------------------------------------------
             */

            for (
                let i =
                    ripples.length - 1;
                i >= 0;
                i--
            ) {
                if (
                    ripples[i].age >
                    ripples[i].life
                ) {
                    ripples.splice(
                        i,
                        1
                    );
                }
            }

            /*
             * --------------------------------------------------
             * CANVAS DRAW
             * --------------------------------------------------
             */

            ctx.clearRect(
                0,
                0,
                width,
                height
            );

            drawSurfaceGlow(
                speed
            );

            drawRipples();

            /*
             * --------------------------------------------------
             * TRAIL EVAPORATION
             * --------------------------------------------------
             */

            if (
                !active &&
                points.length > 0
            ) {
                points.shift();

                if (
                    points.length >
                    0
                ) {
                    points.shift();
                }
            }

            /*
             * Shimmer speed.
             */

            const shimmerIntensity =
                clamp(
                    speed / 16,
                    0,
                    1
                );

            shimmer.style.setProperty(
                "--speed",
                shimmerIntensity.toFixed(
                    3
                )
            );

            animationFrame =
                requestAnimationFrame(
                    animate
                );
        };

        /*
         * ======================================================
         * EVENTS
         * ======================================================
         */

        footer.addEventListener(
            "pointerenter",
            handlePointerEnter
        );

        footer.addEventListener(
            "pointermove",
            handlePointerMove
        );

        footer.addEventListener(
            "pointerleave",
            handlePointerLeave
        );

        animationFrame =
            requestAnimationFrame(
                animate
            );

        return () => {
            cancelAnimationFrame(
                animationFrame
            );

            resizeObserver.disconnect();

            footer.removeEventListener(
                "pointerenter",
                handlePointerEnter
            );

            footer.removeEventListener(
                "pointermove",
                handlePointerMove
            );

            footer.removeEventListener(
                "pointerleave",
                handlePointerLeave
            );
        };
    }, []);

    return (
        <footer
            ref={footerRef}
            className="footer"
        >
            {/* =============================================
                LIQUID SURFACE
            ============================================= */}

            <canvas
                ref={liquidCanvasRef}
                className="footer__liquid-canvas"
                aria-hidden="true"
            />

            {/* =============================================
                BACKGROUND SHIMMER
            ============================================= */}

            <div
                ref={shimmerRef}
                className="footer__shimmer"
                aria-hidden="true"
            />

            {/* =============================================
                EXISTING HEART + WAKE
            ============================================= */}

            <div
                className="footer__sea"
                aria-hidden="true"
            >
                <svg
                    className="footer__wake"
                    preserveAspectRatio="none"
                >
                    <path
                        ref={wakeOuterRef}
                        className="footer__wake-outer"
                    />

                    <path
                        ref={wakeMiddleRef}
                        className="footer__wake-middle"
                    />

                    <path
                        ref={wakeInnerRef}
                        className="footer__wake-inner"
                    />
                </svg>

                <div
                    ref={heartRef}
                    className="footer__heart"
                >
                    <span>♥</span>
                </div>
            </div>

            {/* =============================================
                YOUR REAL FOOTER CONTENT
            ============================================= */}

            <div className="footer-container">
                <div className="footer-brand">
                    <div className="footer-logo">
                        <span className="footer-logo-mark">
                            ◈
                        </span>

                        <span>
                            FWUNOTES
                        </span>
                    </div>

                    <p className="footer-desc">
                        Academic repository engineered
                        by and for students of Far Western
                        University Faculty of Engineering.
                        Focused on deterministic access to
                        syllabus, validated lecture notes,
                        and archival examination papers.
                    </p>

                    <div className="footer-status">
                        <span className="status-dot" />

                        <span>
                            System Operational
                        </span>

                        <span>•</span>

                        <span>
                            Fall 2025/2026
                        </span>

                        <span>•</span>

                        <span>
                            Syllabus v2.4
                        </span>
                    </div>

                    <div className="footer-socials">
                        <a
                            href="https://facebook.com"
                            target="_blank"
                            rel="noreferrer"
                            aria-label="Facebook"
                        >
                            f
                        </a>

                        <a
                            href="https://whatsapp.com"
                            target="_blank"
                            rel="noreferrer"
                            aria-label="WhatsApp"
                        >
                            w
                        </a>

                        <a
                            href="https://instagram.com"
                            target="_blank"
                            rel="noreferrer"
                            aria-label="Instagram"
                        >
                            ◎
                        </a>

                        <a
                            href="mailto:support@fwunotes.edu.np"
                            aria-label="Email FWU Notes"
                        >
                            @
                        </a>

                        <a
                            href="https://linkedin.com"
                            target="_blank"
                            rel="noreferrer"
                            aria-label="LinkedIn"
                        >
                            in
                        </a>
                    </div>
                </div>

                <div className="footer-links-grid">
                    <nav className="footer-column">
                        <h4>
                            SEMESTERS
                        </h4>

                        <div className="semesters-subgrid">
                            <a href="/sem/1">
                                Sem I
                            </a>
                            <a href="/sem/2">
                                Sem II
                            </a>
                            <a href="/sem/3">
                                Sem III
                            </a>
                            <a href="/sem/4">
                                Sem IV
                            </a>
                            <a href="/sem/5">
                                Sem V
                            </a>
                            <a href="/sem/6">
                                Sem VI
                            </a>
                            <a href="/sem/7">
                                Sem VII
                            </a>
                            <a href="/sem/8">
                                Sem VIII
                            </a>
                        </div>
                    </nav>

                    <nav className="footer-column">
                        <h4>
                            QUICK RESOURCES
                        </h4>

                        <a href="#papers">
                            Past Exam Papers
                        </a>

                        <a href="#model">
                            Model Questions
                        </a>

                        <a href="#manuals">
                            Lab Manuals
                        </a>

                        <a href="#syllabus">
                            Curriculum &amp; Syllabus
                        </a>

                        <a href="#rules">
                            Submission Guidelines
                        </a>
                    </nav>

                    <nav className="footer-column">
                        <h4>
                            TOOLS &amp; CAMPUS
                        </h4>

                        <a href="#sgpa">
                            GPA / SGPA Calculator
                        </a>

                        <a href="#formulas">
                            Formula Sheets
                        </a>

                        <a href="#unit">
                            Unit Converter
                        </a>

                        <a
                            href="https://fwu.edu.np"
                            target="_blank"
                            rel="noreferrer"
                        >
                            FWU Official Site
                            <span aria-hidden="true">
                                ↗
                            </span>
                        </a>

                        <a href="#directory">
                            Faculty Directory
                        </a>
                    </nav>
                </div>
            </div>

            <div className="footer-bottom">
                <div className="footer-bottom-container">
                    <p>
                        © 2025 Far Western University
                        • Faculty of Engineering.
                        All technical rights reserved.
                    </p>

                    <div className="footer-legal">
                        <a href="/about">
                            About
                        </a>

                        <a href="/disclaimer">
                            Disclaimer
                        </a>

                        <a href="/Terms">
                            Terms
                        </a>

                        <a href="#privacy">
                            Privacy Policy
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;