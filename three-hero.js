// Kreatixlab Premium 3D Hero Animation
document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.querySelector('canvas.webgl');
    if(!canvas) return;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    // Push camera back for a wider view of the geometry
    camera.position.z = 6;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true,
        powerPreference: "high-performance"
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Groups - for clean hierarchical rotations
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // 1. Outer Abstract Tech Shape (Icosahedron)
    const geometry = new THREE.IcosahedronGeometry(2.5, 1);
    
    // Wireframe Material with Cyan hue
    const material = new THREE.MeshBasicMaterial({
        color: 0x0EA5E9,
        wireframe: true,
        transparent: true,
        opacity: 0.15
    });

    const mesh = new THREE.Mesh(geometry, material);
    mainGroup.add(mesh);

    // 2. Inner Glowing Core
    const coreGeometry = new THREE.IcosahedronGeometry(1.5, 2);
    const coreMaterial = new THREE.MeshBasicMaterial({
        color: 0x8B5CF6,
        wireframe: true,
        transparent: true,
        opacity: 0.25
    });
    const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
    mainGroup.add(coreMesh);

    // 3. Immersive Particles Field
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1200; // High particle density for a premium feel
    const posArray = new Float32Array(particlesCount * 3);

    for(let i = 0; i < particlesCount * 3; i++) {
        // Spread particles out over a large area
        posArray[i] = (Math.random() - 0.5) * 20;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    // Electric blue particles with additive blending to create a glow
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.03,
        color: 0x06B6D4,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // 4. Interactive Mouse Tracking
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    let windowHalfX = window.innerWidth / 2;
    let windowHalfY = window.innerHeight / 2;

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - windowHalfX);
        mouseY = (event.clientY - windowHalfY);
    });

    // Handle Resize Fluidly
    window.addEventListener('resize', () => {
        windowHalfX = window.innerWidth / 2;
        windowHalfY = window.innerHeight / 2;
        
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });

    // 5. Cinematic Animation Loop
    const clock = new THREE.Clock();

    const tick = () => {
        const elapsedTime = clock.getElapsedTime();

        // Complex multi-axis autonomous rotation
        mesh.rotation.y = elapsedTime * 0.12;
        mesh.rotation.x = elapsedTime * 0.15;
        mesh.rotation.z = Math.sin(elapsedTime * 0.5) * 0.2;
        
        coreMesh.rotation.y = -elapsedTime * 0.2;
        coreMesh.rotation.z = elapsedTime * 0.15;

        // Space feeling
        particlesMesh.rotation.y = -elapsedTime * 0.03;
        particlesMesh.rotation.x = Math.sin(elapsedTime * 0.2) * 0.1;

        // Smooth mouse following interpolation (damping)
        targetX = mouseX * 0.001;
        targetY = mouseY * 0.001;
        
        // Tilt the entire geometry construct based on cursor
        mainGroup.rotation.y += 0.05 * (targetX - mainGroup.rotation.y);
        mainGroup.rotation.x += 0.05 * (targetY - mainGroup.rotation.x);
        
        // Parallax effect on particles 
        particlesMesh.position.y += 0.05 * (-targetY * 0.5 - particlesMesh.position.y);
        particlesMesh.position.x += 0.05 * (-targetX * 0.5 - particlesMesh.position.x);

        // Render scene
        renderer.render(scene, camera);

        // Loop next frame
        window.requestAnimationFrame(tick);
    }

    tick();
});
