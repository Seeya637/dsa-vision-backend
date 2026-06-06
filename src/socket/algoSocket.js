import { runAlgorithm } from '../services/algoRunner.js';

export function initSocket(io) {

  io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);

    // ── Client sends: run-algo ──────────────────────────
    // data = { algo, inputData, speed }
    socket.on('run-algo', async (data) => {
      const { algo, inputData, speed } = data;

      console.log(`Running ${algo} on ${inputData.length} elements`);

      try {
        const { steps, total } = runAlgorithm(algo, inputData);

        // emit total so frontend knows how many steps coming
        socket.emit('algo-start', { total, algo });

        // stream each step with delay = speed
        for (let i = 0; i < steps.length; i++) {

          // check if client disconnected mid-stream
          if (!socket.connected) break;

          // emit single step
          socket.emit('algo-step', {
            step:    steps[i],
            index:   i,
            total,
          });

          // wait = speed (from frontend)
          await sleep(speed || 300);
        }

        // all steps done
        socket.emit('algo-done', { total });

      } catch (err) {
        socket.emit('algo-error', { message: err.message });
      }
    });

    // ── Client sends: stop ──────────────────────────────
    socket.on('stop', () => {
      console.log(`Stop requested by ${socket.id}`);
      // disconnecting stops the loop because socket.connected = false
      socket.disconnect();
    });

    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}