// Bước 2: Khởi tạo WebGL
function initWebGL() {
  const canvas = document.getElementById("webglCanvas");
  const gl = canvas.getContext("webgl");

  if (!gl) {
    console.error("WebGL không được hỗ trợ trên trình duyệt này!");
    return null;
  }
  
  return gl;
}

// Bước 3: Khai báo Shader để vẽ hình đầu tiên với webGL
// Vertex Shader
const vertexShaderSource = `
  attribute vec2 a_position;
  void main() {
    gl_Position = vec4(a_position, 0, 1);
  }
`;

// Fragment Shader
const fragmentShaderSource = `
  void main() {
    gl_FragColor = vec4(1, 0, 0, 1); // Màu đỏ
  }
`;

// Bước 4: Biên dịch shader và tạo chương trình webgl
function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("Lỗi biên dịch shader:", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createProgram(gl, vertexShaderSource, fragmentShaderSource) {
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("Lỗi liên kết chương trình:", gl.getProgramInfoLog(program));
    return null;
  }
  
  return program;
}

// Bước 5: Cung cấp dữ liệu hình học (tọa độ, vị trí)
function createTriangleBuffer(gl) {
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  const positions = [
    -0.5, -0.5,
     0.5, -0.5,
     0.0,  0.5,
  ];

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
  
  return positionBuffer;
}

// Bước 6: Kết nối dữ liệu với Shader
function connectPositionAttribute(gl, program) {
  const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
  gl.enableVertexAttribArray(positionAttributeLocation);
  gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
  
  return positionAttributeLocation;
}

// Bước 7: Vẽ hình
function drawTriangle(gl) {
  gl.clearColor(0, 0, 0, 1); // Đặt màu nền
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLES, 0, 3); // Vẽ tam giác
}

// 2.3.1 Phép tịnh tiến (Translation)
// Vertex shader cho phép tịnh tiến
const translationVertexShaderSource = `
  attribute vec2 a_position;
  uniform vec2 u_translation;
  void main() {
    gl_Position = vec4(a_position + u_translation, 0, 1);
  }
`;

// Fragment shader cho phép tịnh tiến
const translationFragmentShaderSource = `
  precision mediump float;
  void main() {
    gl_FragColor = vec4(0, 1, 0, 1); // Màu xanh lá cây
  }
`;

// Áp dụng phép tịnh tiến
function applyTranslation(gl, program) {
  const translationLocation = gl.getUniformLocation(program, "u_translation");
  
  // Giá trị tịnh tiến (tx = 0.5, ty = 0.2)
  const translation = [0.5, 0.2];
  
  gl.uniform2fv(translationLocation, translation);
}

// 2.3.2 Phép quay (Rotation)
// Vertex shader cho phép quay
const rotationVertexShaderSource = `
  attribute vec2 a_position;
  
  uniform vec2 u_resolution;
  uniform vec2 u_translation;
  uniform vec2 u_rotation;
  uniform vec2 u_scale;
  
  void main() {
    // Scale the position
    vec2 scaledPosition = a_position * u_scale;
    
    // Rotate the position
    vec2 rotatedPosition = vec2(
      scaledPosition.x * u_rotation.y + scaledPosition.y * u_rotation.x,
      scaledPosition.y * u_rotation.y - scaledPosition.x * u_rotation.x);
  
    // Add in the translation.
    vec2 position = rotatedPosition + u_translation;
    
    // convert the position from pixels to 0.0 to 1.0
    vec2 zeroToOne = position / u_resolution;
    
    // convert from 0->1 to 0->2
    vec2 zeroToTwo = zeroToOne * 2.0;
    
    // convert from 0->2 to -1->+1 (clipspace)
    vec2 clipSpace = zeroToTwo - 1.0;
    
    gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
  }
`;

// Fragment shader cho phép quay
const rotationFragmentShaderSource = `
  precision mediump float;
  
  uniform vec4 u_color;
  
  void main() {
     gl_FragColor = u_color;
  }
`;

// Áp dụng phép quay
function applyRotation(gl, program) {
  const rotationLocation = gl.getUniformLocation(program, "u_rotation");
  
  // Giá trị quay (sin(angle), cos(angle))
  const rotation = [0, 1]; // Không quay (góc = 0)
  
  gl.uniform2fv(rotationLocation, rotation);
}

// Tạo buffer cho hình ngôi nhà
function setGeometry(gl) {
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
    // Thân nhà (hình chữ nhật)
    0, 0,      // điểm dưới trái
    100, 0,    // điểm dưới phải
    0, 80,     // điểm trên trái
    0, 80,     // điểm trên trái
    100, 0,    // điểm dưới phải
    100, 80,   // điểm trên phải

    // Mái nhà (hình tam giác)
    0, 80,     // điểm trái
    100, 80,   // điểm phải
    50, 120,   // điểm đỉnh

    // Cửa (hình chữ nhật)
    35, 0,     // điểm dưới trái
    65, 0,     // điểm dưới phải
    35, 50,    // điểm trên trái
    35, 50,    // điểm trên trái
    65, 0,     // điểm dưới phải
    65, 50,    // điểm trên phải

    // Cửa sổ (hình vuông)
    15, 55,    // điểm dưới trái
    35, 55,    // điểm dưới phải
    15, 75,    // điểm trên trái
    15, 75,    // điểm trên trái
    35, 55,    // điểm dưới phải
    35, 75,    // điểm trên phải

    // Cửa sổ (hình vuông)
    65, 55,    // điểm dưới trái
    85, 55,    // điểm dưới phải
    65, 75,    // điểm trên trái
    65, 75,    // điểm trên trái
    85, 55,    // điểm dưới phải
    85, 75     // điểm trên phải
    ]),
    gl.STATIC_DRAW);
}

// Hàm chính để chạy ứng dụng WebGL
function main() {
  // Khởi tạo WebGL
  const gl = initWebGL();
  if (!gl) return;
  
  // Tạo chương trình WebGL với shader cho phép quay
  const program = createProgram(gl, rotationVertexShaderSource, rotationFragmentShaderSource);
  if (!program) return;
  
  // Sử dụng chương trình
  gl.useProgram(program);
  
  // Tạo buffer và thiết lập thuộc tính
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  setGeometry(gl);
  
  // Kết nối dữ liệu với shader
  const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
  gl.enableVertexAttribArray(positionAttributeLocation);
  gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
  
  // Lấy vị trí của các uniform
  const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
  const colorLocation = gl.getUniformLocation(program, "u_color");
  const translationLocation = gl.getUniformLocation(program, "u_translation");
  const rotationLocation = gl.getUniformLocation(program, "u_rotation");
  const scaleLocation = gl.getUniformLocation(program, "u_scale");
  
  // Thiết lập resolution
  gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);
  
  // Thiết lập màu
  const color = [Math.random(), Math.random(), Math.random(), 1];
  gl.uniform4fv(colorLocation, color);
  
  // Thiết lập các giá trị ban đầu
  const translation = [100, 150];
  const rotation = [0, 1];
  const scale = [1, 1];
  
  // Thiết lập UI
  webglLessonsUI.setupSlider("#x", {value: translation[0], slide: updatePosition(0), max: gl.canvas.width });
  webglLessonsUI.setupSlider("#y", {value: translation[1], slide: updatePosition(1), max: gl.canvas.height});
  webglLessonsUI.setupSlider("#angle", {slide: updateAngle, max: 360});
  webglLessonsUI.setupSlider("#scaleX", {value: scale[0], slide: updateScale(0), min: 0.1, max: 5, step: 0.1});
  webglLessonsUI.setupSlider("#scaleY", {value: scale[1], slide: updateScale(1), min: 0.1, max: 5, step: 0.1});
  
  // Thêm checkbox để bật/tắt animation
  const animationCheckbox = document.getElementById("animation");
  let isAnimating = animationCheckbox ? animationCheckbox.checked : false;
  let animationId = null;
  
  if (animationCheckbox) {
    animationCheckbox.addEventListener("change", function(event) {
      isAnimating = event.target.checked;
      if (isAnimating) {
        animate();
      } else if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
      }
    });
  }
  
  // Thêm checkbox để bật/tắt chế độ nhiều đối tượng
  const multipleObjectsCheckbox = document.getElementById("multipleObjects");
  let showMultipleObjects = multipleObjectsCheckbox ? multipleObjectsCheckbox.checked : false;
  
  if (multipleObjectsCheckbox) {
    multipleObjectsCheckbox.addEventListener("change", function(event) {
      showMultipleObjects = event.target.checked;
      drawScene();
    });
  }
  
  function updatePosition(index) {
    return function(event, ui) {
      translation[index] = ui.value;
      drawScene();
    };
  }
  
  function updateScale(index) {
    return function(event, ui) {
      scale[index] = ui.value;
      drawScene();
    };
  }
  
  function updateAngle(event, ui) {
    var angleInDegrees = 360 - ui.value;
    var angleInRadians = angleInDegrees * Math.PI / 180;
    rotation[0] = Math.sin(angleInRadians);
    rotation[1] = Math.cos(angleInRadians);
    drawScene();
  }
  
  // Hàm animation
  function animate() {
    if (!isAnimating) return;
    
    // Thời gian hiện tại (dùng để tạo hiệu ứng animation)
    const time = Date.now() * 0.001; // Chuyển đổi sang giây
    
    // Animation cho đối tượng chính
    // Di chuyển theo đường sin
    translation[0] = gl.canvas.width / 2 + Math.sin(time) * 100;
    translation[1] = gl.canvas.height / 2 + Math.cos(time) * 50;
    
    // Quay theo thời gian
    const angleInRadians = time % (2 * Math.PI);
    rotation[0] = Math.sin(angleInRadians);
    rotation[1] = Math.cos(angleInRadians);
    
    // Thay đổi kích thước theo thời gian
    const scaleValue = 1.0 + Math.sin(time * 2) * 0.3;
    scale[0] = scaleValue;
    scale[1] = scaleValue;
    
    // Vẽ cảnh
    drawScene();
    
    // Tiếp tục animation
    animationId = requestAnimationFrame(animate);
  }
  
  // Vẽ cảnh
  function drawScene() {
    webglUtils.resizeCanvasToDisplaySize(gl.canvas);
    
    // Tell WebGL how to convert from clip space to pixels
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    
    // Clear the canvas.
    gl.clear(gl.COLOR_BUFFER_BIT);
    
    // Tell it to use our program (pair of shaders)
    gl.useProgram(program);
    
    // Turn on the attribute
    gl.enableVertexAttribArray(positionAttributeLocation);
    
    // Bind the position buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    
    // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    var size = 2;          // 2 components per iteration
    var type = gl.FLOAT;   // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0;        // start at the beginning of the buffer
    gl.vertexAttribPointer(
        positionAttributeLocation, size, type, normalize, stride, offset);
    
    // set the resolution
    gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);
    
    if (showMultipleObjects) {
      // Vẽ nhiều đối tượng với các phép biến đổi khác nhau
      const numObjects = 5;
      const time = Date.now() * 0.001; // Thời gian hiện tại (giây)
      
      for (let i = 0; i < numObjects; i++) {
        // Tạo màu ngẫu nhiên nhưng ổn định cho mỗi đối tượng
        const objectColor = [
          Math.sin(0.3 * i + 1) * 0.5 + 0.5,
          Math.sin(0.3 * i + 2) * 0.5 + 0.5,
          Math.sin(0.3 * i + 3) * 0.5 + 0.5,
          1.0
        ];
        gl.uniform4fv(colorLocation, objectColor);
        
        // Tính toán vị trí dựa trên thời gian và chỉ số đối tượng
        const angle = (2 * Math.PI * i / numObjects) + time;
        const radius = gl.canvas.height / 3;
        const objectTranslation = [
          gl.canvas.width / 2 + Math.cos(angle) * radius,
          gl.canvas.height / 2 + Math.sin(angle) * radius
        ];
        gl.uniform2fv(translationLocation, objectTranslation);
        
        // Tính toán góc quay dựa trên thời gian và chỉ số đối tượng
        const rotationAngle = time + (i * Math.PI / numObjects);
        const objectRotation = [
          Math.sin(rotationAngle),
          Math.cos(rotationAngle)
        ];
        gl.uniform2fv(rotationLocation, objectRotation);
        
        // Tính toán tỷ lệ dựa trên thời gian và chỉ số đối tượng
        const objectScale = [
          0.5 + 0.5 * Math.sin(time + i),
          0.5 + 0.5 * Math.cos(time + i)
        ];
        gl.uniform2fv(scaleLocation, objectScale);
        
        // Vẽ đối tượng
        gl.drawArrays(gl.TRIANGLES, 0, 24); // 8 tam giác, 3 đỉnh mỗi tam giác
      }
    } else {
      // Vẽ một đối tượng duy nhất với các giá trị từ thanh trượt
      gl.uniform4fv(colorLocation, color);
      gl.uniform2fv(translationLocation, translation);
      gl.uniform2fv(rotationLocation, rotation);
      gl.uniform2fv(scaleLocation, scale);
      
      // Draw the geometry.
      gl.drawArrays(gl.TRIANGLES, 0, 24); // 8 tam giác, 3 đỉnh mỗi tam giác
    }
  }
  
  // Bắt đầu animation nếu checkbox được chọn
  if (isAnimating) {
    animate();
  } else {
    drawScene();
  }
}

// Chạy ứng dụng khi trang đã tải xong
window.onload = main; 