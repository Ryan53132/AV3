import axios from "axios";
import { performance } from "node:perf_hooks";

async function testUsers(count) {
  const url = "http://localhost:3000/sua-rota";

  const promises = [];

  for (let i = 0; i < count; i++) {
    const inicio = performance.now();

    const p = axios.get(url)
      .then(() => ({
        tempo: performance.now() - inicio,
      }))
      .catch(() => ({
        tempo: performance.now() - inicio,
      }));

    promises.push(p);
  }

  const resultados = await Promise.all(promises);

  console.log(`\n===== ${count} usuário(s) =====`);
  resultados.forEach((r, i) => {
    console.log(`Usuário ${i + 1}: ${r.tempo.toFixed(2)} ms`);
  });
}

(async () => {
  await testUsers(1);
  await testUsers(5);
  await testUsers(10);
})();
