//canvas
const canvas = document.querySelector("#webgl");
import * as THREE from "three";

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

  const geometry1 = new THREE.PlaneGeometry(3, 5);
  const geometry2 = new THREE.PlaneGeometry(3, 5);
  const geometry3 = new THREE.PlaneGeometry(3, 5);
  const geometry4 = new THREE.PlaneGeometry(3, 5);
  const geometry5 = new THREE.PlaneGeometry(3, 5);
  const geometry6 = new THREE.PlaneGeometry(3, 5);

  const material = new THREE.MeshBasicMaterial({
    map: new THREE.TextureLoader().load("/img/pic.jpg"),
  });
  const cube1 = new THREE.Mesh(geometry1, material);
  const cube2 = new THREE.Mesh(geometry2, material);
  const cube3 = new THREE.Mesh(geometry3, material);
  const cube4 = new THREE.Mesh(geometry4, material);
  const cube5 = new THREE.Mesh(geometry5, material);
  const cube6 = new THREE.Mesh(geometry6, material);

  scene.add(cube1, cube2, cube3, cube4, cube5, cube6);

  camera.position.z = 30;
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
    cube1.position.x = 8 * Math.cos(rotation + Math.PI / 3);
    cube1.position.z = 8 * Math.sin(rotation + Math.PI / 3);
    cube2.position.x = 8 * Math.cos(rotation + 2 * (Math.PI / 3));
    cube2.position.z = 8 * Math.sin(rotation + 2 * (Math.PI / 3));
    cube3.position.x = 8 * Math.cos(rotation + Math.PI);
    cube3.position.z = 8 * Math.sin(rotation + Math.PI);
    cube4.position.x = 8 * Math.cos(rotation + 4 * (Math.PI / 3));
    cube4.position.z = 8 * Math.sin(rotation + 4 * (Math.PI / 3));
    cube5.position.x = 8 * Math.cos(rotation + 5 * (Math.PI / 3));
    cube5.position.z = 8 * Math.sin(rotation + 5 * (Math.PI / 3));
    cube6.position.x = 8 * Math.cos(rotation);
    cube6.position.z = 8 * Math.sin(rotation);

    //   mesh1.position.x = rotation;
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
