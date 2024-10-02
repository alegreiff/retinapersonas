import React, { useEffect, useState } from "react";

interface Props {
  name: string;
  personas: any[];
}

const BuscaPersonas = ({ name, personas }: Props) => {
  const [busca, setBusca] = useState<string>("");
  const [persona, setPersona] = useState<number>(0);
  const [resPersonas, setResPersonas] = useState<any[]>(personas);
  const [humano, setHumano] = useState<any>([]);

  const handleChange = (event: any) => {
    console.log(event.target.value);
    setBusca(event.target.value);
  };
  const selPersona = (persona: number) => {
    setPersona(persona);
  };
  //https://retinalatina.org/wp-json/ra/v1/lista_talento/49853

  useEffect(() => {
    console.log(busca, "has changed");
    const res = personas.filter((item: any) => item.nombre.includes(busca));
    setResPersonas(res);
  }, [busca, personas]);

  useEffect(() => {
    console.log("Persona has been selected", persona);
    const getHumano = async () => {
      const response = await fetch(
        `https://retinalatina.org/wp-json/ra/v1/lista_talento/${persona}`
      );
      const data = await response.json();
      setHumano(data);
    };

    if (persona > 0) {
      getHumano();
    } else {
      setHumano([]);
    }
  }, [persona]);

  return (
    <div className="bg-amber-400 h-64">
      {resPersonas.length}
      <input type="text" onChange={handleChange} value={busca} />
      <h1>Your name is: {busca}</h1>
      <button onClick={() => setPersona(0)}>Borra</button>
      {busca.length} ---
      <div className="bg-slate-900 flex gap-4 justify-between">
        <div className="bg-green-200 w-full">
          {busca.length > 2 &&
            resPersonas.map((item: any) => (
              <button
                onClick={() => selPersona(item.id)}
                className="btn btn-xs block p-1 m-1"
                key={item.id}
              >
                {item.id} {item.nombre}
              </button>
            ))}
        </div>
        <div className="bg-pink-200 w-full">
          {humano && <pre>{JSON.stringify(humano, null, 2)}</pre>}
        </div>
      </div>
    </div>
  );
};

export default BuscaPersonas;
