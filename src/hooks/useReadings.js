import { useState, useEffect } from 'react';

const mockReadings = [
    {
        type: 'Primera Lectura',
        reference: 'Libro de Isaías 43, 16-21',
        text: `Así dice el Señor, que abrió un camino en el mar y una senda en las aguas impetuosas; el que hizo salir carros y caballos, tropa y valientes; caían para no levantarse, se apagaron como mecha que se extingue.\n\n«No recordéis lo de antaño, no penséis en lo antiguo; mirad que realizo algo nuevo; ya está brotando, ¿no lo notáis? Abriré un camino por el desierto, ríos en el yermo. Me glorificarán las bestias del campo, chacales y avestruces, porque ofreceré agua en el desierto, ríos en el yermo, para apagar la sed de mi pueblo, de mi elegido, el pueblo que yo me formé para que proclamara mi alabanza».`
    },
    {
        type: 'Salmo Responsorial',
        reference: 'Sal 125, 1-2ab. 2cd-3. 4-5. 6',
        text: `R/. El Señor ha estado grande con nosotros, y estamos alegres.\n\nCuando el Señor cambió la suerte de Sión,\nnos parecía soñar:\nla boca se nos llenaba de risas,\nla lengua de cantares.\n\nHasta los gentiles decían:\n«El Señor ha estado grande con ellos».\nEl Señor ha estado grande con nosotros,\ny estamos alegres.\n\nQue el Señor cambie nuestra suerte,\ncomo los torrentes del Negueb.\nLos que siembran con lágrimas,\ncosechan entre cantares.\n\nAl ir, iba llorando,\nllevando la semilla;\nal volver, vuelve cantando,\ntrayendo sus gavillas.`
    },
    {
        type: 'Segunda Lectura',
        reference: 'Carta del apóstol san Pablo a los Filipenses 3, 8-14',
        text: `Hermanos:\nTodo lo considero una pérdida comparado con la excelencia del conocimiento de Cristo Jesús, mi Señor. Por él lo perdí todo, y todo lo considero basura con tal de ganar a Cristo y ser hallado en él, no con una justicia mía, la de la ley, sino con la que viene de la fe de Cristo, la justicia que viene de Dios y se apoya en la fe.\nPara conocerlo a él, y la fuerza de su resurrección, y la comunión con sus padecimientos, muriendo su misma muerte, para llegar un día a la resurrección de entre los muertos.\nNo es que ya haya conseguido el premio, o que ya sea perfecto: yo sigo adelante, buscando alcanzarlo, como yo mismo he sido alcanzado por Cristo Jesús. Hermanos, yo no pienso haberlo alcanzado. Digo solamente esto: olvidándome de lo que queda atrás y lanzándome hacia lo que está por delante, corro hacia la meta, para ganar el premio, al que Dios desde arriba me llama en Cristo Jesús.`
    },
    {
        type: 'Evangelio',
        reference: 'Lectura del santo evangelio según san Juan 8, 1-11',
        text: `En aquel tiempo, Jesús se retiró al monte de los Olivos. Al amanecer se presentó de nuevo en el templo, y todo el pueblo acudía a él, y, sentándose, les enseñaba.\nLos escribas y los fariseos le traen una mujer sorprendida en adulterio, y, colocándola en medio, le dijeron:\n«Maestro, esta mujer ha sido sorprendida en flagrante adulterio. La ley de Moisés nos manda apedrear a las adúlteras; tú, ¿qué dices?».\nLe preguntaban esto para comprometerlo y poder acusarlo. Pero Jesús, inclinándose, escribía con el dedo en el suelo.\nComo insistían en preguntarle, se incorporó y les dijo:\n«El que esté sin pecado, que le tire la primera piedra».\nE inclinándose otra vez, siguió escribiendo.\nEllos, al oírlo, se fueron escabullendo uno a uno, empezando por los más viejos. Y quedó solo Jesús, con la mujer, que seguía en medio.\nJesús se incorporó y le preguntó:\n«Mujer, ¿dónde están tus acusadores?; ¿ninguno te ha condenado?».\nElla contestó:\n«Ninguno, Señor».\nJesús dijo:\n«Tampoco yo te condeno. Anda, y en adelante no peques más».`
    }
];

const useReadings = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({ readings: [], date: '' });

    useEffect(() => {
        // Simulate API call
        const timer = setTimeout(() => {
            const today = new Date();
            const dateString = today.toLocaleDateString('es-ES', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });
            setData({ readings: mockReadings, date: dateString });
            setLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    return { ...data, loading };
};

export default useReadings;
