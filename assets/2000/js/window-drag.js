let dragObj = null, lastX = 0, lastY = 0;
const reInit = () => {
  document.querySelectorAll(".drag").forEach((elem) => {
    elem.style.position = "fixed";
    const handle = elem.querySelector(".handle") || elem;
    handle.onmousedown = handle.ontouchstart = (e) => {
      dragObj = elem;
      const pos = e.touches ? e.touches[0] : e;
      lastX = pos.pageX;
      lastY = pos.pageY;
    };
  });
};
const moveDrag = (e) => {
  if (!dragObj) return;
  const pos = e.touches ? e.touches[0] : e;
  const dx = pos.pageX - lastX;
  const dy = pos.pageY - lastY;
  dragObj.style.left = `${dragObj.offsetLeft + dx}px`;
  dragObj.style.top = `${dragObj.offsetTop + dy}px`;
  lastX = pos.pageX;
  lastY = pos.pageY;
  if (e.touches) e.preventDefault();
};
window.onload = reInit;
document.onmouseup = document.ontouchend = () => (dragObj = null);
document.onmousemove = document.ontouchmove = moveDrag;