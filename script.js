const apiKey = '5dec4225b0c3705176f46382'; // api key para acceder a la API exchange rate
const monedasObjetivo = ['USD', 'EUR', 'GBP', 'JPY', 'CAD','MXN']; // lista de tipoos de moneda a consultar
const select = document.getElementById('monedaBase'); // select para elegir un tipo de cambio de moned
const baseLabel = document.getElementById('baseLabel'); //titulo de la pagina, se actualiza cuando se selecciona algo diferente en el select

let chart; // Variable global para la gráfica

async function obtenerDatos(base) { // funcion asyncrona para consultar datos de la api 
  const url = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${base}`; // url de la api, se agrega la apikey y el tipo de cambio a consultar

  try {

    // Llamada a la API
    const res = await fetch(url); 
    const data = await res.json();
    const tasas = data.conversion_rates; // regresa una lista clave-valor con las monedas y su valor con respecto al tipo de cambio que hemos elegido

    const valores = monedasObjetivo.map(moneda => tasas[moneda]); // crea una lista nueva con los valores de las monedas de que nos interesan
    actualizarGrafica(monedasObjetivo, valores, base); // actualiza la grafica con los nuevos valores

  } catch (error) {
    console.error('Error al obtener los datos:', error); // caso de que la llamada a la api falle lanza un mensaje de error
  }
}

// la funcion recibe labels:tipos de monedas ej: MXN USD, data: valor de cada moneda, base: tipo de cambio ej: USD, MXN etc.
function actualizarGrafica(labels, data, base) {
  baseLabel.textContent = base;

  if (chart) { // si chart ya fue creado reemplaza los datos viejos por los nuevos
    chart.data.datasets[0].data = data;
    chart.data.labels = labels;
    chart.update();
  } else { // si la grafica no ha sido creada, la crea y agreg los datos a visualizar
    const ctx = document.getElementById('graficaDivisas').getContext('2d');
    chart = new Chart(ctx, {
      type: 'bar', // tipo de grafica, para este caso será una grafica de barras
      data: {
        labels: labels,
        datasets: [{
          label: `Valor en otras divisas`,
          data: data, // datos de cada moneda
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  }
}

// Cargar gráfico inicial
obtenerDatos(select.value);

// Escuchar cambios en el select
select.addEventListener('change', () => {
  obtenerDatos(select.value);
});
