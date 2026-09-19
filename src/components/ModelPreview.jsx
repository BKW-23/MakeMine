import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export default function ModelPreview({ src, alt, layers = [] }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.01, 100);
    camera.position.set(0, 0.2, 3.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    scene.add(new THREE.HemisphereLight(0xfff4fb, 0x69516b, 2.2));
    const keyLight = new THREE.DirectionalLight(0xffffff, 3);
    keyLight.position.set(2, 3, 4);
    scene.add(keyLight);
    const fillLight = new THREE.DirectionalLight(0xffb6dc, 1.5);
    fillLight.position.set(-3, 1, 2);
    scene.add(fillLight);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.minDistance = 1.5;
    controls.maxDistance = 5;
    controls.target.set(0, 0, 0);

    let frameId;
    let model;
    let modelSize = new THREE.Vector3(1, 1, 1);
    let renderedLayersKey = "";
    const stickerGroup = new THREE.Group();
    const resize = () => {
      const width = container.clientWidth || 1;
      const height = container.clientHeight || 1;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };
    const observer = new ResizeObserver(resize);
    observer.observe(container);
    resize();

    new GLTFLoader().load(
      src,
      (gltf) => {
        model = gltf.scene;
        model.traverse((object) => {
          if (object.isMesh) {
            object.castShadow = true;
            object.receiveShadow = true;
          }
        });
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        modelSize = size.clone();
        const maxSize = Math.max(size.x, size.y, size.z) || 1;
        model.position.sub(center);
        model.scale.setScalar(2.1 / maxSize);
        model.add(stickerGroup);
        renderedLayersKey = "";
        scene.add(model);
      },
      undefined,
      (error) => console.error("Unable to load product model.", error),
    );

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      controls.update();
      const layersKey = layers.map((layer) => `${layer.id}:${layer.x}:${layer.y}:${layer.scale}:${layer.opacity}`).join("|");
      if (layersKey !== renderedLayersKey) {
        renderedLayersKey = layersKey;
        stickerGroup.clear();
        layers.forEach((layer) => {
          const image = layer.sticker.icon || layer.sticker.image;
          const texture = new THREE.Texture();
          const material = new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: false, depthWrite: false });
          const sprite = new THREE.Sprite(material);
          sprite.position.set(
            ((layer.x - 50) / 50) * modelSize.x * 0.42,
            ((50 - layer.y) / 50) * modelSize.y * 0.42,
            modelSize.z * 0.6,
          );
          sprite.renderOrder = 10;
          sprite.material.opacity = layer.opacity / 100;
          sprite.scale.set(modelSize.x * 0.16 * layer.scale, modelSize.y * 0.16 * layer.scale, 1);
          stickerGroup.add(sprite);
          new THREE.TextureLoader().load(image, (loadedTexture) => {
            texture.image = loadedTexture.image;
            texture.needsUpdate = true;
            const aspect = loadedTexture.image.width / loadedTexture.image.height || 1;
            sprite.scale.setX(sprite.scale.y * aspect);
          });
        });
      }
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      observer.disconnect();
      controls.dispose();
      if (model) {
        model.traverse((object) => {
          if (object.isMesh) {
            object.geometry.dispose();
            if (Array.isArray(object.material)) object.material.forEach((material) => material.dispose());
            else object.material.dispose();
          }
        });
      }
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [src, layers]);

  return <div ref={containerRef} role="img" aria-label={alt} className="absolute inset-0 h-full w-full" />;
}
