

function Verificar() {
    var codigoIngresado = document.getElementById("factura").value;

  if (codigoIngresado === "1") {
    document.getElementById("facturaexistente").style.display = "block";
    document.getElementById("errornofactura").style.display = "none";
  } else {
    document.getElementById("facturaexistente").style.display = "none";
    document.getElementById("errornofactura").style.display = "block";
  }
}
