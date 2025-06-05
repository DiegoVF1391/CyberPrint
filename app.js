const fs = require('fs');
const path = require('path');
const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');
const { exec } = require('child_process');

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { headless: true },
});

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
    console.log("Escanea el QR con tu WhatsApp Web.");
});

client.on('ready', () => {
    console.log('✅ Conectado a WhatsApp.');
});

const mensajeInicio = Date.now(); // marca la hora de inicio del programa

client.on('message', async message => {
    const timestamp = message.timestamp * 1000; // WhatsApp usa segundos, lo convertimos a ms

    if (timestamp < mensajeInicio) {
        return; // Ignora mensajes anteriores a la hora en que inició el programa
    }

    if (message.hasMedia) {
        const media = await message.downloadMedia();
        const ext = media.mimetype.split("/")[1] || "bin";
        const nombreArchivo = `documento_${Date.now()}.${ext}`;
        const ruta = path.join(__dirname, 'documentos_recibidos', nombreArchivo);

        fs.writeFileSync(ruta, media.data, 'base64');
        console.log(`📥 Archivo recibido y guardado como: ${nombreArchivo}`);

        exec(`python imprimir.py "${ruta}"`, (error, stdout, stderr) => {
            if (error) {
                console.error(`❌ Error al imprimir: ${error.message}`);
            } else {
                console.log(`🖨️ Archivo enviado a imprimir.`);
            }
        });
    }
});


client.initialize();
