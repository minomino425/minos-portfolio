//canvas
const canvas = document.querySelector("#webgl");
import * as THREE from "three";
import imgUrl from "./img/pic.jpg";
import hamUrl from "./img/ham.png";

init();
async function init() {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    35,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);

  let geometry;
  for (let i = 0; i < 6; ++i) {
    geometry = new THREE.PlaneGeometry(3, 4.2);
  }

  const material = new THREE.MeshBasicMaterial({
    map: new THREE.TextureLoader().load(imgUrl),
  });
  const hamMaterial = new THREE.MeshBasicMaterial({
    map: new THREE.TextureLoader().load(hamUrl),
  });

  const cube1 = new THREE.Mesh(geometry, material);
  const cube2 = new THREE.Mesh(geometry, material);
  const cube3 = new THREE.Mesh(geometry, material);
  const cube4 = new THREE.Mesh(geometry, material);
  const cube5 = new THREE.Mesh(geometry, material);
  const cube6 = new THREE.Mesh(geometry, material);

  scene.add(cube1, cube2, cube3, cube4, cube5, cube6);

  const planeArray = [cube1, cube2, cube3, cube4, cube5, cube6];

  camera.position.z = 30;

  // Raycaster のインスタンスを生成する @@@
  const raycaster = new THREE.Raycaster();
  // マウスのクリックイベントの定義 @@@
  // window.addEventListener(
  //   "click",
  //   (mouseEvent) => {
  //     // スクリーン空間の座標系をレイキャスター用に正規化する（-1.0 ~ 1.0 の範囲）
  //     const x = (mouseEvent.clientX / window.innerWidth) * 2.0 - 1.0;
  //     const y = (mouseEvent.clientY / window.innerHeight) * 2.0 - 1.0;
  //     // 上下が反転している点に注意
  //     const v = new THREE.Vector2(x, -y);
  //     // レイキャスターに正規化済みマウス座標とカメラを指定する
  //     raycaster.setFromCamera(v, camera);
  //     // scene に含まれるすべてのオブジェクトを対象にレイキャストする
  //     const intersects = raycaster.intersectObjects(planeArray);
  //     // レイが交差しなかった場合を考慮し一度マテリアルをリセットしておく
  //     planeArray.forEach((mesh) => {
  //       mesh.material = material;
  //     });
  //     if (intersects.length > 0) {
  //       intersects[0].object.material = hamMaterial;
  //       console.log(intersects[0].object);
  //     }
  //   },
  //   false
  // );
  window.addEventListener(
    "mousemove",
    (mouseEvent) => {
      // スクリーン空間の座標系をレイキャスター用に正規化する（-1.0 ~ 1.0 の範囲）
      const x = (mouseEvent.clientX / window.innerWidth) * 2.0 - 1.0;
      const y = (mouseEvent.clientY / window.innerHeight) * 2.0 - 1.0;
      // 上下が反転している点に注意
      const v = new THREE.Vector2(x, -y);
      // レイキャスターに正規化済みマウス座標とカメラを指定する
      raycaster.setFromCamera(v, camera);
      // scene に含まれるすべてのオブジェクトを対象にレイキャストする
      const intersects = raycaster.intersectObjects(planeArray);
      // レイが交差しなかった場合を考慮し一度マテリアルをリセットしておく
      planeArray.forEach((mesh) => {
        mesh.material = material;
        document.querySelector("body").style.cursor = "initial";
      });
      if (intersects.length > 0) {
        intersects[0].object.material = hamMaterial;
        console.log(intersects[0].object);
        document.querySelector("body").style.cursor = "pointer";
      }
    },
    false
  );

  //サイズ
  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  //ホイールを実装してみよう
  let speed = 0;
  let rotation = 0;

  window.addEventListener("wheel", (event) => {
    speed += event.deltaY * 0.0002;
  });

  function rot() {
    rotation += speed;
    speed *= 0.93;
    //ジオメトリ全体を回転させる
    const mathPositionRatio = (cube, multi) => {
      cube.position.x =
        8 * Math.cos(rotation + multi * (Math.PI / 3) + Math.PI / 6);
      cube.position.z =
        8 * Math.sin(rotation + multi * (Math.PI / 3) + Math.PI / 6);
    };
    let num = 1;
    planeArray.forEach((cube, index) => {
      mathPositionRatio(cube, index + num);
    });
    window.requestAnimationFrame(rot);
  }

  rot();

  //ブラウザのリサイズ操作
  window.addEventListener("resize", () => {
    //サイズのアップデート
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    //カメラのアップデート
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    //レンダラーのアップデート
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(window.devicePixelRatio);
  });

  let i = 0;
  function animate() {
    requestAnimationFrame(animate);
    // console.log(i++);
    //  cube.rotation.x = cube.rotation.x + 0.01;
    //  cube.rotation.y += 0.01;

    renderer.render(scene, camera);
  }

  animate();
}
