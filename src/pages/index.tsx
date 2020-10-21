import React, { Dispatch, useState } from "react";
// import Logo from "../assets/vilken_pizza_logo.png";

type LogoProps = {
  white?: boolean;
};
function Logo({ white }: LogoProps) {
  return (
    <div className="logo-container">
      <div className={`logo ${white ? "white" : ""}`}></div>
    </div>
  );
}

function Stripes({ children }) {
  return (
    <>
      <div className="stripes-spacer"></div>
      <div className="stripes outer">
        <div className="inner"></div>
        {children}
      </div>
      <div className="stripes-spacer"></div>
    </>
  );
}

type PizzaProp = {
  children: any;
  pizzaLoading: boolean;
  randomizePizza: any;
};

function Pizza({ children, pizzaLoading, randomizePizza }) {
  return (
    <div className="pizza">
      {!children && <div className="header">Vilken pizza får det lov att vara?</div>}
      {!children && !pizzaLoading && (
        <button className="button" onClick={randomizePizza}>
          Välj åt mig!
        </button>
      )}
      <div className="header">
        {pizzaLoading && <span style={{ fontSize: "18px" }}>Letar efter pizza...</span>}
        {!pizzaLoading && children}
        {!pizzaLoading && children && "!"}
      </div>
    </div>
  );
}

type GreenProps = {
  children: any;
  visible?: boolean;
};

function Green({ children, visible }: GreenProps) {
  return (
    <div className={`green-wrapper ${visible ? "visible" : ""}`}>
      <div className="green-spacer"></div>
      <div className="green">{children}</div>
      <div className="green-spacer"></div>
    </div>
  );
}

type FoodoraProps = {
  confirmPosition: any;
  orderPizza: any;
  positionConfirmed?: boolean;
};

function Foodora({ confirmPosition, orderPizza, positionConfirmed }: FoodoraProps) {
  let functionToUse = positionConfirmed ? orderPizza : confirmPosition;
  return (
    <div className="foodora">
      <div className="header">Beställ från Foodora</div>
      {!positionConfirmed && (
        <div className="text-wrapper">
          <div className="text">
            För att kunna länka till Foodora så behöver du acceptera att Vilken pizza? får åtkomst till din position.
            Anledningen till detta är för att kunna hämta information om pizzerior nära dig. Är det OK?
          </div>
        </div>
      )}
      {positionConfirmed && (
        <div className="text-wrapper">
          <div className="text">
            Nu är det bara ett enda litet steg kvar innan din nybakta pizza ligger framför dig. Klicka på knappen nedan
            för att hitta en restaurang som inte bara lagar din pizza, utan även kör den hem till dig.
          </div>
        </div>
      )}
      {
        <button className={`button ${positionConfirmed ? "foodora" : ""}`} onClick={functionToUse}>
          {positionConfirmed ? "Till Foodora!" : "Ja såklart!"}
        </button>
      }

      {/* {positionConfirmed && (
        <button className="button" onClick={orderPizza}>
          Till Foodora!
        </button>
      )} */}
    </div>
  );
}

type SatsifiedProps = {
  visible: boolean;
  dialogue?: { app: string; user: string };
  randomizePizza: any;
  disabled: boolean;
};

function Satisfied({ visible, dialogue, randomizePizza, disabled }: SatsifiedProps) {
  return (
    <div className="satisfied">
      <div className={`content ${visible && "visible"}`}>
        {dialogue && (
          <>
            <div className={`header ${disabled ? "disabled" : ""}`}>{dialogue.app}</div>
            <button disabled={disabled} className="button" onClick={randomizePizza}>
              {dialogue.user}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function Footer() {
  return (
    <div className="footer">
      <div className="header">Tack för besöket!</div>
      <Logo white></Logo>
      <div className="text">
        Vilken pizza? är ett verktyg som med hjälp av artificell intelligens och maskininlärning tar fram den optimala
        pizzan för just ditt behov. Den avancerade algoritm som Vilken pizza? använder körs på hundratals kvant-datorer
        i molnet vilket garanterar ett optimalt resultat varje gång.
      </div>
    </div>
  );
}

const pizzas = ["Vesuvio", "Capricciosa", "Kebabpizza"];
const sauces = ["", "kebabsås", "vitlökssås"];
const dialogues = [
  {
    app: "Är du nöjd?",
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

  const setRandomPizza = async noScroll => {
    if (!noScroll) {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }
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
      <Logo></Logo>
      <Stripes>
        <Pizza pizzaLoading={pizzaLoading} randomizePizza={setRandomPizza}>
          {pizza}
        </Pizza>
      </Stripes>
      <Green visible={!pizzaLoading && !!pizza}>
        <Foodora confirmPosition={confirmPosition} orderPizza={orderPizza} positionConfirmed={!!position}></Foodora>
      </Green>
      <Satisfied
        visible={!pizzaLoading && !!pizza}
        dialogue={dialogues[nLoaded]}
        randomizePizza={() => setRandomPizza(false)}
        disabled={nLoaded === 2}
      ></Satisfied>
      <Footer></Footer>
      {false && (
        <div className="main">
          <div className="content">
            {/* <img className="logo" src={Logo}></img> */}
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
                  position. Anledningen till detta är för att kunna hämta information om pizzerior nära dig. Är det OK?
                </p>
                {!position && <button onClick={confirmPosition}>Ja, såklart!</button>}
                {position && (
                  <button className="foodora" onClick={orderPizza}>
                    Till Foodora!
                  </button>
                )}
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
            Vilken pizza? är ett verktyg som med hjälp av artificell intelligens och maskininlärning tar fram den
            optimala pizzan för just ditt behov. Den avancerade algoritm som Vilken pizza? använder körs på hundratals
            kvant-datorer i molnet vilket garanterar ett optimalt resultat varje gång.
          </footer>
        </div>
      )}
    </>
  );
  // }
}

// https://www.foodora.se/restaurants/new?lat=57.72879500000001&lng=12.0107913&vertical=restaurants&query=Kebabpizza
