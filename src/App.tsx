import {FC, ReactNode, useCallback, useState} from "react";

type Param = {
  id: number
  name: string
  type: "string" // | "number" | "list"
}

type ParamValue = {
  paramId: number
  value: string
}

type Model = {
  paramValues: ParamValue[]
}

type Props = {
  params: Param[]
  model: Model
}

export const App = () => {
  const params: Param[] = [
    { id: 1, name: "Назначение", type: 'string' },
    { id: 2, name: "Длина", type: 'string' },
  ];

  const model: Model = {
    paramValues: [
      { paramId: 1, value: "повседневное" },
      { paramId: 2, value: "макси" },
    ],
  };

  return <ParamEditor params={params} model={model} />
}


const getParamsMap = (params: ParamValue[]) => {
  return new Map(params.map(({ paramId, value }) => [paramId, value]))
}

const ParamEditor: FC<Props> = ({ params, model }) => {
  const [paramValues, setParamValues] = useState<Map<number, string>> (
    getParamsMap(model.paramValues)
  );

  const getModel = (): Model => {
    return {
      paramValues: Array.from(paramValues, ([paramId, value]) => ({
        paramId,
        value,
      }))
    }
  };

  const renderParamElement = useCallback((param: Param) => {
    const handleChange = (paramId: number, value: string) => {
      setParamValues(prev => new Map(prev).set(paramId, value));
    };

    const paramElementsMap: Record<Param["type"], ReactNode> =  {
      string: (
        <input
          type="text"
          value={paramValues.get(param.id) || ''}
          onChange={(e) => handleChange(param.id, e.target.value)}
        />
      ),
      // number: <input type="number" />,
      // list: <select>{list.map(item => <option key={item}>{item}</option>)}</select>
    }

    return paramElementsMap[param.type] || null
  }, [paramValues]);

  return (
    <div>
      <h2>Редактор параметров</h2>
        {params.map((param) => (
          <div key={param.id}>
              {param.name}:
              {renderParamElement(param)}
            </div>
          )
        )}
      <button onClick={() => console.log(getModel())}>Show Model</button>
    </div>
  );
};