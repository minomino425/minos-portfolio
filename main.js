//canvas
const canvas = document.querySelector("#webgl");
import * as THREE from "three";
import imgUrl01 from "./img/01.jpg";
import imgUrl02 from "./img/02.jpg";
import imgUrl03 from "./img/03.jpg";
import imgUrl04 from "./img/04.jpg";
import imgUrl05 from "./img/05.jpg";
import imgUrl06 from "./img/06.jpg";
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
  let material;
  let planeArray = [];
  let materialArray = [];
  let mesh;
  for (let i = 0; i < 6; ++i) {
    geometry = new THREE.PlaneGeometry(5, 8);
    // console.log("./img/0" + (i + 1) + ".jpg");
    // material = new THREE.MeshBasicMaterial({
    //   map: new THREE.TextureLoader().load("./img/0" + (i + 1) + ".jpg"),
    // });
    let loader = new THREE.TextureLoader();
    let imgPath = "./img/0" + (i + 1) + ".jpg";
    let texture = loader.load(imgPath); // テクスチャ読み込み
    let uniforms = {
      uTexture: { value: texture },
      uImageAspect: { value: 2512 / 4345 }, //画像のアスペクト
      uPlaneAspect: { value: 500 / 800 }, //プレーンのアスペクト
      uTime: { value: 0 },
    };
    material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: document.getElementById("v-shader").textContent,
      fragmentShader: document.getElementById("f-shader").textContent,
    });
    mesh = new THREE.Mesh(geometry, material);
    planeArray.push(mesh);
    scene.add(planeArray[i]);

    materialArray.push(material);

    console.log(i,uniforms)
  }

  // console.log(materialArray);
  const hamMaterial = new THREE.MeshBasicMaterial({
    map: new THREE.TextureLoader().load(hamUrl),
  });

  // const cube1 = new THREE.Mesh(geometry, material);
  // const cube2 = new THREE.Mesh(geometry, material);
  // const cube3 = new THREE.Mesh(geometry, material);
  // const cube4 = new THREE.Mesh(geometry, material);
  // const cube5 = new THREE.Mesh(geometry, material);
  // const cube6 = new THREE.Mesh(geometry, material);

  // const planeArray = [cube1, cube2, cube3, cube4, cube5, cube6];

  camera.position.z = 40;

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
      planeArray.forEach((mesh, index) => {
        mesh.material = materialArray[index];
        // console.log(materialArray[index]);
        document.querySelector("body").style.cursor = "initial";
      });
      if (intersects.length > 0) {
        intersects[0].object.material = hamMaterial;
        // console.log(intersects[0].object);
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
        12 * Math.cos(rotation + multi * (Math.PI / 3) + Math.PI / 6);
      cube.position.z =
        12 * Math.sin(rotation + multi * (Math.PI / 3) + Math.PI / 6);
    };
    let num = 1;
    planeArray.forEach((cube, index) => {
      mathPositionRatio(cube, index + num);
    });
    mesh.material.uniforms.uTime.value++;
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
