import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { DecalGeometry } from "three/examples/jsm/geometries/DecalGeometry.js";

export default function ModelPreview({ src, alt, layers = [], selectedId, onSelectLayer, onMoveLayer, onResetView }) {
  const containerRef = useRef(null);
  const layersRef = useRef(layers);
  const selectedIdRef = useRef(selectedId);
  const onSelectLayerRef = useRef(onSelectLayer);
  const onMoveLayerRef = useRef(onMoveLayer);
  layersRef.current = layers;
  selectedIdRef.current = selectedId;
  onSelectLayerRef.current = onSelectLayer;
  onMoveLayerRef.current = onMoveLayer;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.01, 100);
    camera.up.set(-1, 0, 0);
    camera.position.set(0, 3.2, 0.2);

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
    const resetView = () => {
      camera.up.set(-1, 0, 0);
      camera.position.set(0, 3.2, 0.2);
      controls.target.set(0, 0, 0);
      controls.update();
    };
    onResetView?.(() => resetView);

    let frameId;
    let model;
    let modelSize = new THREE.Vector3(1, 1, 1);
    let defaultSurface = null;
    let renderedLayersKey = "";
    const stickerGroup = new THREE.Group();
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const modelMeshes = [];
    let draggingLayer = null;
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
            if (Array.isArray(object.material)) object.material.forEach((material) => { material.side = THREE.FrontSide; material.depthWrite = true; });
            else if (object.material) { object.material.side = THREE.FrontSide; object.material.depthWrite = true; }
            modelMeshes.push(object);
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
        model.updateMatrixWorld(true);
        raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);
        const centerHit = raycaster.intersectObjects(modelMeshes, false)[0];
        if (centerHit?.face) {
          const worldNormal = centerHit.face.normal.clone().transformDirection(centerHit.object.matrixWorld);
          defaultSurface = {
            position: model.worldToLocal(centerHit.point.clone()).toArray(),
            normal: worldNormal.clone().transformDirection(model.matrixWorld.clone().invert()).normalize().toArray(),
          };
        }
        renderedLayersKey = "";
        scene.add(model);
      },
      undefined,
      (error) => console.error("Unable to load product model.", error),
    );

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      controls.update();
      const currentLayers = layersRef.current;
      const layersKey = `${selectedIdRef.current}|${currentLayers.map((layer) => `${layer.id}:${layer.x}:${layer.y}:${layer.scale}:${layer.opacity}:${layer.rotation || 0}:${JSON.stringify(layer.surface || null)}`).join("|")}`;
      if (layersKey !== renderedLayersKey) {
        renderedLayersKey = layersKey;
        while (stickerGroup.children.length) {
          const child = stickerGroup.children.pop();
          child.geometry?.dispose();
          child.material?.map?.dispose();
          child.material?.dispose();
        }
        currentLayers.forEach((layer) => {
          if (!modelMeshes[0]) return;
          const image = layer.sticker.icon || layer.sticker.image;
          const surface = layer.surface || defaultSurface;
          const position = surface?.position
            ? new THREE.Vector3(...surface.position)
            : new THREE.Vector3(0, 0, modelSize.z * 0.5);
          const normal = surface?.normal
            ? new THREE.Vector3(...surface.normal)
            : new THREE.Vector3(0, 0, 1);
          const orientation = new THREE.Euler().setFromQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal));
          orientation.z += THREE.MathUtils.degToRad(layer.rotation || 0);
          new THREE.TextureLoader().load(image, (texture) => {
            const aspect = texture.image.width / texture.image.height || 1;
            const material = new THREE.MeshBasicMaterial({
              map: texture,
              transparent: true,
              depthTest: true,
              polygonOffset: true,
              polygonOffsetFactor: -4,
              side: THREE.FrontSide,
              opacity: layer.opacity / 100,
            });
            const decal = new DecalGeometry(
              modelMeshes[0],
              position,
              orientation,
              new THREE.Vector3(
                modelSize.x * 0.16 * layer.scale * aspect,
                modelSize.x * 0.16 * layer.scale,
                Math.max(modelSize.z * 0.04, 0.001),
              ),
            );
            const mesh = new THREE.Mesh(decal, material);
            mesh.userData.layerId = layer.id;
            mesh.renderOrder = 10;
            stickerGroup.add(mesh);
            if (layer.id === selectedIdRef.current) {
              const outlineMaterial = new THREE.LineBasicMaterial({ color: 0x3b82f6, depthTest: false });
              const outline = new THREE.LineSegments(
                new THREE.EdgesGeometry(new THREE.PlaneGeometry(
                  modelSize.x * 0.16 * layer.scale * aspect,
                  modelSize.x * 0.16 * layer.scale,
                )),
                outlineMaterial,
              );
              outline.position.copy(position);
              outline.rotation.copy(orientation);
              outline.renderOrder = 20;
              outline.userData.layerId = layer.id;
              stickerGroup.add(outline);
            }
          });
        });
      }
      renderer.render(scene, camera);
    };
    const updatePointer = (event) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
    };
    const getFrontModelHit = () => {
      const intersections = raycaster.intersectObjects(modelMeshes, false);
      return intersections.find((intersection) => {
        if (!intersection.face) return true;
        const worldNormal = intersection.face.normal
          .clone()
          .transformDirection(intersection.object.matrixWorld);
        return worldNormal.dot(raycaster.ray.direction) < 0;
      });
    };
    const onPointerDown = (event) => {
      event.stopPropagation();
      updatePointer(event);
      const decals = raycaster.intersectObjects(stickerGroup.children, false);
      const hitDecal = decals[0]?.object;
      if (hitDecal?.userData.layerId) {
        draggingLayer = hitDecal.userData.layerId;
        onSelectLayerRef.current?.(draggingLayer);
        controls.enabled = false;
        return;
      }
      const hitModel = getFrontModelHit();
      if (!hitModel) {
        onSelectLayerRef.current?.(null);
        return;
      }
      onSelectLayerRef.current?.(null);
    };
    const onPointerMove = (event) => {
      if (!draggingLayer) return;
      updatePointer(event);
      const hit = getFrontModelHit();
      if (!hit) return;
      const position = model.worldToLocal(hit.point.clone());
      const worldNormal = hit.face.normal.clone().transformDirection(hit.object.matrixWorld);
      const normal = worldNormal
        .clone()
        .transformDirection(model.matrixWorld.clone().invert())
        .normalize();
      onMoveLayerRef.current?.(draggingLayer, { position: position.toArray(), normal: normal.toArray() });
    };
    const onPointerUp = () => {
      draggingLayer = null;
      controls.enabled = true;
    };
    renderer.domElement.addEventListener("pointerdown", onPointerDown);
    renderer.domElement.addEventListener("pointermove", onPointerMove);
    renderer.domElement.addEventListener("pointerup", onPointerUp);
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      observer.disconnect();
      controls.dispose();
      renderer.domElement.removeEventListener("pointerdown", onPointerDown);
      renderer.domElement.removeEventListener("pointermove", onPointerMove);
      renderer.domElement.removeEventListener("pointerup", onPointerUp);
      onResetView?.(null);
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
  }, [src]);

  return <div ref={containerRef} role="img" aria-label={alt} className="absolute inset-0 h-full w-full" />;
}
