import React, { Dispatch, useState } from "react";

const pizzas = ["Vesuvio", "Capricciosa", "Kebabpizza"];
const sauces = ["", "kebabsås", "vitlökssås"];
const dialogues = [
  {
    app: "Inte nöjd?",
    user: "Nä, välj en ny pizza åt mig!",
  },
  {
    app: "Nu är du väl nöjd?",
    user: "Nej, jag är fortfarande inte nöjd!",
  },
  {
    app: "Du fick tre chanser. Inte en chans att du inte är nöjd nu!",
    user: "Tack! Jag är nöjd nu.",
  },
];

const randomPizza = () => {
  const randomIndex = Math.floor(Math.random() * pizzas.length);
  return pizzas.find((p, i) => i === randomIndex);
};

const randomSauce = () => {
  const randomIndex = Math.floor(Math.random() * sauces.length);
  return sauces.find((p, i) => i === randomIndex);
};

export default function Home() {
  const [pizza, setPizza]: [string | null, Dispatch<any>] = useState(null);
  const [position, setPosition]: [Position, Dispatch<any>] = useState(null);
  const [clicked, setClicked]: [boolean, Dispatch<any>] = useState(false);
  const [{ pizzaLoading, nLoaded }, setPizzaLoading]: [
    { pizzaLoading: boolean; nLoaded: number },
    Dispatch<any>
  ] = useState({
    pizzaLoading: false,
    nLoaded: -1,
  });

  const timeout = (delay: number) => {
    return new Promise(res => setTimeout(res, delay));
  };

  const constructPizzaWithSauce = (pizza: string, sauce: string): string => {
    return `${pizza}${sauce ? ` med ${sauce}` : ""}`;
  };

  const constructFoodoraUrl = (position: Position, pizza: string): string => {
    return `https://www.foodora.se/restaurants/new?lat=${position.coords.latitude}&lng=${position.coords.longitude}&vertical=restaurants&query=${pizza}`;
  };

  const getPosition = async (): Promise<Position> => {
    const position: Position = await new Promise((res, rej) =>
      navigator.geolocation.getCurrentPosition(
        position => {
          res(position);
        },
        error => {
          rej(error);
        }
      )
    );
    return position;
  };

  const confirmPosition = async () => {
    const position = await getPosition();
    setPosition(position);
  };

  const orderPizza = () => {
    const foodoraUrl = constructFoodoraUrl(position, pizza);
    window.open(foodoraUrl, "_blank");
  };

  const setRandomPizza = async () => {
    setClicked(true);
    setPizzaLoading({ pizzaLoading: true, nLoaded });
    const pizza = randomPizza();
    const sauce = randomSauce();

    const pizzaWithSauce = constructPizzaWithSauce(pizza, sauce);
    setPizza(pizzaWithSauce);
    await timeout(2000);
    setPizzaLoading({ pizzaLoading: false, nLoaded: nLoaded + 1 });
  };

  // render() {
  return (
    <>
      <div className="main">
        <div className="content">
          <h1>Vilken Pizza?</h1>
          <p>Vilken pizza vill du äta?</p>
          <button disabled={clicked} onClick={setRandomPizza}>
            Välj åt mig!
          </button>
          {clicked && <p>OK! Du ska äta...</p>}
          {!pizzaLoading && pizza && <h1>{pizza}!</h1>}
          <p></p>
          {!pizzaLoading && pizza && (
            <>
              <h2>Beställ från Foodora</h2>
              <p className="pos-info">
                För att kunna länka till Foodora så behöver du acceptera att Vilken pizza? får åtkomst till din
                position. Anledningen till detta är för att kunna hämta information om pizzerior nära dig!
              </p>
              {!position && <button onClick={confirmPosition}>Det är OK!</button>}
              {position && <button onClick={orderPizza}>Till Foodora!</button>}
              <div className="spacer"></div>
              <p className="small">{dialogues[nLoaded]?.app}</p>
              <button disabled={nLoaded === 2} onClick={setRandomPizza}>
                {dialogues[nLoaded]?.user}
              </button>
              <div className="spacer"></div>
            </>
          )}
        </div>
        <footer>
          Vilken pizza? är ett verktyg som med hjälp av artificell intelligens och maskininlärning tar fram den optimala
          pizzan för just ditt behov. Den avancerade algoritm som Vilken pizza? använder körs på hundratals
          kvant-datorer i molnet vilket garanterar ett optimalt resultat varje gång.
        </footer>
      </div>
    </>
  );
  // }
}

// https://www.foodora.se/restaurants/new?lat=57.72879500000001&lng=12.0107913&vertical=restaurants&query=Kebabpizza
