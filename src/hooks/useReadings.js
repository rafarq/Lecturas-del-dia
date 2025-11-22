import { useState, useEffect } from 'react';
import { XMLParser } from 'fast-xml-parser';

// Mock data used as fallback when RSS fails or no readings for today
const MOCK_READINGS = {
    date: new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
    readings: [
        {
            type: 'Primera Lectura',
            reference: 'Hechos 2, 1-11',
            text: 'Al llegar el día de Pentecostés, estaban todos reunidos en el mismo lugar. De repente, un ruido del cielo, como de un viento recio, resonó en toda la casa donde se encontraban. Vieron aparecer unas lenguas, como llamaradas, que se repartían, posándose encima de cada uno. Se llenaron todos de Espíritu Santo y empezaron a hablar en lenguas extranjeras, cada uno en la lengua que el Espíritu le sugería.'
        },
        {
            type: 'Salmo Responsorial',
            reference: 'Salmo 103',
            text: 'R. Envía tu Espíritu, Señor, y repuebla la faz de la tierra.\n\nBendice, alma mía, al Señor:\n¡Dios mío, qué grande eres!\nCuántas son tus obras, Señor;\nla tierra está llena de tus criaturas.'
        },
        {
            type: 'Evangelio',
            reference: 'Juan 20, 19-23',
            text: 'Al anochecer de aquel día, el primero de la semana, estaban los discípulos en una casa, con las puertas cerradas por miedo a los judíos. Y en esto entró Jesús, se puso en medio y les dijo: «Paz a vosotros». Y, diciendo esto, les enseñó las manos y el costado. Y los discípulos se llenaron de alegría al ver al Señor. Jesús repitió: «Paz a vosotros. Como el Padre me ha enviado, así también os envío yo». Y, dicho esto, sopló sobre ellos y les dijo: «Recibid el Espíritu Santo; a quienes les perdonéis los pecados, les quedan perdonados; a quienes se los retengáis, les quedan retenidos».'
        }
    ]
};

// Mapping of RSS categories to readable names
const CATEGORY_MAP = {
    'LECTIO 1': 'Primera Lectura',
    'LECTIO 2': 'Segunda Lectura',
    'PSALMUS': 'Salmo Responsorial',
    'EVANGELIUM': 'Evangelio'
};

/**
 * Hook that fetches the daily Catholic readings and obtains a cached/reflection
 * from the server endpoint `/api/reflection`. If the endpoint fails, a simple
 * fallback message is used.
 */
export const useReadings = () => {
    const [readings, setReadings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReadings = async () => {
            try {
                // 1️⃣ Fetch RSS feed
                const rssResp = await fetch('https://rss.evangelizo.org/rss/v2/evangelizo_rss-sp.xml');
                if (!rssResp.ok) throw new Error('Failed to fetch RSS');
                const xmlText = await rssResp.text();
                const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '@_' });
                const result = parser.parse(xmlText);
                if (!result.rss || !result.rss.channel || !result.rss.channel.item) throw new Error('Invalid RSS format');
                const items = Array.isArray(result.rss.channel.item) ? result.rss.channel.item : [result.rss.channel.item];

                // 2️⃣ Filter items for today
                const today = new Date();
                const monthNames = {
                    enero: 0, febrero: 1, marzo: 2, abril: 3, mayo: 4, junio: 5, julio: 6, agosto: 7, septiembre: 8, octubre: 9, noviembre: 10, diciembre: 11
                };
                const todayItems = items.filter(item => {
                    const title = item.title || '';
                    const match = title.match(/(\d+)\s+De\s+(\w+)/i);
                    if (match) {
                        const day = parseInt(match[1]);
                        const month = match[2].toLowerCase();
                        const monthNum = monthNames[month];
                        return day === today.getDate() && monthNum === today.getMonth();
                    }
                    return false;
                });

                if (todayItems.length === 0) {
                    setReadings(MOCK_READINGS);
                    return;
                }

                // 3️⃣ Build structured readings array
                const readingsArray = [];
                const processed = new Set();
                todayItems.forEach(item => {
                    const cat = item.category;
                    const type = CATEGORY_MAP[cat];
                    if (type && !processed.has(cat)) {
                        processed.add(cat);
                        const title = item.title || '';
                        const parts = title.split(':');
                        const reference = parts.length > 1 ? parts[1].trim() : '';
                        let text = item.description || '';
                        text = text.replace(/<!\[CDATA\[/g, '').replace(/\]\]>/g, '').replace(/<[^>]*>/g, '').trim();
                        if (text && reference) {
                            readingsArray.push({ type, reference, text });
                        }
                    }
                });

                // Order the readings in the traditional sequence
                const order = ['Primera Lectura', 'Salmo Responsorial', 'Segunda Lectura', 'Evangelio'];
                readingsArray.sort((a, b) => order.indexOf(a.type) - order.indexOf(b.type));

                if (readingsArray.length === 0) {
                    setReadings(MOCK_READINGS);
                    return;
                }

                // 4️⃣ Obtain reflection from server (cached or freshly generated)
                let reflection = '';
                try {
                    const reflResp = await fetch('/api/reflection.php');
                    if (!reflResp.ok) throw new Error('Reflection endpoint error');
                    const data = await reflResp.json();
                    reflection = data.reflection;
                } catch (e) {
                    console.error('Failed to get reflection from server:', e);
                    // Simple fallback if the server is unreachable
                    reflection = 'Hoy quiero hablarte al corazón. Las lecturas que has recibido son mi palabra viva para ti. Te pido que las medites con calma y permitas que transformen tu vida. Confía en mí, porque te amo y deseo lo mejor para ti.';
                }

                // 5️⃣ Assemble final readings list with the reflection as the first card
                const finalReadings = [
                    { type: 'Reflexión del Día', reference: 'Jesús te habla', text: reflection },
                    ...readingsArray
                ];

                const formatted = {
                    date: new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
                    readings: finalReadings
                };
                setReadings(formatted);
            } catch (err) {
                console.error('Error fetching readings:', err);
                setReadings(MOCK_READINGS);
                setError(err);
            } finally {
                setLoading(false);
            }
        };
        fetchReadings();
    }, []);

    return { readings, loading, error };
};
