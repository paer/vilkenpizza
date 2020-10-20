import React, { Dispatch, useState } from "react";

const pizzas = ["Vesuvio", "Capricciosa", "Kebabpizza"];
const sauces = ["", "kebabsås", "vitlökssås"];

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
  const [clicked, setClicked]: [boolean, Dispatch<any>] = useState(false);
  const [pizzaLoading, setPizzaLoading]: [boolean, Dispatch<any>] = useState(false);

  // constructor(props) {
  //   super(props);

  // }
  function timeout(delay: number) {
    return new Promise(res => setTimeout(res, delay));
  }

  const setRandomPizza = async () => {
    setClicked(true);
    setPizzaLoading(true);
    const pizza = randomPizza();
    const sauce = randomSauce();

    const pizzaWithSauce = `${pizza}${sauce ? ` med ${sauce}` : ""}`;
    setPizza(pizzaWithSauce);
    await timeout(2000);
    setPizzaLoading(false);
  };

  // render() {
  return (
    <div className="main">
      <h1>Vilken pizza?</h1>
      <p>Vilken pizza vill du äta?</p>
      <button disabled={clicked} onClick={setRandomPizza}>
        Välj åt mig!
      </button>
      {clicked && <p>OK! Du ska äta...</p>}
      {!pizzaLoading && pizza && <h1>{pizza}!</h1>}
      <p></p>
      {!pizzaLoading && pizza && (
        <>
          <button>Beställ från Foodora</button>
          <p className="small">Inte nöjd?</p>
          <button onClick={setRandomPizza}>Nä, välj en ny pizza åt mig!</button>
        </>
      )}
      <footer>
        Vilken pizza? är ett verktyg som med hjälp av artificell intelligens och maskininlärning tar fram den optimala
        pizzan för just ditt behov. Den avancerade algoritm som Vilken pizza? använder körs på hundratalet kvant-datorer
        i molnet vilket garanterar ett optimalt resultat varje gång.
      </footer>
    </div>
  );
  // }
}

// https://www.foodora.se/restaurants/new?lat=57.72879500000001&lng=12.0107913&vertical=restaurants&query=Kebabpizza
