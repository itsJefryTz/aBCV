import { useState, useEffect, useContext } from 'react';
import toast, { Toaster } from 'react-hot-toast';

import { Context } from '../context/Context';

export default function Calculator() {
    const ContextValue = useContext(Context);
    const [section, setSection] = useState('BCV');
    const [bsAmount, setBsAmount] = useState('');
    // const [usdAmount, setUsdAmount] = useState('1');
    const [usdAmountBcv, setUsdAmountBcv,] = useState('1');
    const [usdAmountPromedio, setUsdAmountPromedio] = useState('1');
    const [usdAmountParalelo, setUsdAmountParalelo] = useState('1');
    const [lastUpdated, setLastUpdated] = useState('');

    useEffect(() => {
        const initializeBsAmount = () => {
            if (ContextValue.bcvData.price !== undefined) {
                setBsAmount(ContextValue.bcvData.price);
            } 
        };
        initializeBsAmount();
    }, [ContextValue.bcvData.price]);

    useEffect(() => {
        setLastUpdated(ContextValue.bcvData.last_update)
    }, [ContextValue.bcvData]);

    const ChangeSection = (e) => {
        const sectionValue = e.target.value;
        if (sectionValue === 'BCV') {
            setUsdAmountBcv('1')
            setBsAmount(ContextValue.bcvData.price)
            setLastUpdated((ContextValue.bcvData.last_update).replace(',', ' |'))
        } else if (sectionValue === 'Promedio') {
            setUsdAmountPromedio('1')
            setBsAmount(ContextValue.promedioData.price)
            setLastUpdated((ContextValue.promedioData.last_update).replace(',', ' |'))
        } else if (sectionValue === 'Paralelo') {
            setUsdAmountParalelo('1')
            setBsAmount(ContextValue.paraleloData.price)
            setLastUpdated((ContextValue.paraleloData.last_update).replace(',', ' |'))
        } else if (sectionValue === 'Equivalent') {
            setUsdAmountBcv('1')
            const resultBcv = (ContextValue.bcvData.price);
            setBsAmount(resultBcv);
            const resultPromedio = (truncateToTwoDecimals(resultBcv / ContextValue.promedioData.price));
            setUsdAmountPromedio(resultPromedio);
            const resultParalelo = (truncateToTwoDecimals(resultBcv / ContextValue.paraleloData.price));
            setUsdAmountParalelo(resultParalelo);
            //
            setLastUpdated(ContextValue.bcvData.last_update + ' | ' + ContextValue.promedioData.last_update + ' | ' + ContextValue.paraleloData.last_update);
        }
        setSection(sectionValue);
        // setUsdAmount('1');
    };

    const truncateToTwoDecimals = (value) => {
        const number = parseFloat(value);
        if (isNaN(number)) return '0.00';
        return (Math.floor(number * 100) / 100).toFixed(2);
    };    

    const handleDollarChange = (e) => {
        const dollarValue = e.target.value.replace(',', '.');
        if (section === 'BCV') {
            setUsdAmountBcv(dollarValue);
        } else if (section === 'Promedio') {
            setUsdAmountPromedio(dollarValue);
        } else if (section === 'Paralelo') {
            setUsdAmountParalelo(dollarValue);
        }
        if (section === 'BCV' && ContextValue.bcvData.price) {
            setBsAmount(truncateToTwoDecimals(dollarValue * ContextValue.bcvData.price).toString());
        } else if (section === 'Promedio' && ContextValue.promedioData.price) {
            setBsAmount(truncateToTwoDecimals(dollarValue * ContextValue.promedioData.price).toString());
        } else if (section === 'Paralelo' && ContextValue.paraleloData.price) {
            setBsAmount(truncateToTwoDecimals(dollarValue * ContextValue.paraleloData.price).toString());
        }
    };

    const handleInputChangeEquivalent = (e) => {
        const { name, value } = e.target;
        const formattedValue = value.replace(',', '.');
        if (name === 'equivalentInputBcv') {
            setUsdAmountBcv(formattedValue);
            setBsAmount(truncateToTwoDecimals(formattedValue * ContextValue.bcvData.price).toString());
            setUsdAmountPromedio(truncateToTwoDecimals((formattedValue * ContextValue.bcvData.price) / ContextValue.promedioData.price).toString());
            setUsdAmountParalelo(truncateToTwoDecimals((formattedValue * ContextValue.bcvData.price) / ContextValue.paraleloData.price).toString());
        } else if (name === 'equivalentInputPromedio') {
            setUsdAmountPromedio(formattedValue);
            setBsAmount(truncateToTwoDecimals(formattedValue * ContextValue.promedioData.price).toString());
            setUsdAmountBcv(truncateToTwoDecimals((formattedValue * ContextValue.promedioData.price) / ContextValue.bcvData.price).toString());
            setUsdAmountParalelo(truncateToTwoDecimals((formattedValue * ContextValue.promedioData.price) / ContextValue.paraleloData.price).toString());
        } else if (name === 'equivalentInputParalelo') {
            setUsdAmountParalelo(formattedValue);
            setBsAmount(truncateToTwoDecimals(formattedValue * ContextValue.paraleloData.price).toString());
            setUsdAmountBcv(truncateToTwoDecimals((formattedValue * ContextValue.paraleloData.price) / ContextValue.bcvData.price).toString());
            setUsdAmountPromedio(truncateToTwoDecimals((formattedValue * ContextValue.paraleloData.price) / ContextValue.promedioData.price).toString());
        }
    }
    
    const handleBsChange = (e) => {
        const bsValue = e.target.value.replace(',', '.');
        setBsAmount(bsValue);
        if (section === 'BCV' && ContextValue.bcvData.price) {
            setUsdAmountBcv(truncateToTwoDecimals(bsValue / ContextValue.bcvData.price).toString());
        } else if (section === 'Promedio' && ContextValue.promedioData.price) {
            setUsdAmountPromedio(truncateToTwoDecimals(bsValue / ContextValue.promedioData.price).toString());
        } else if (section === 'Paralelo' && ContextValue.paraleloData.price) {
            setUsdAmountParalelo(truncateToTwoDecimals(bsValue / ContextValue.paraleloData.price).toString());
        } else if (section === 'Equivalent' && ContextValue.paraleloData.price) {
            setUsdAmountBcv(truncateToTwoDecimals(bsValue / ContextValue.bcvData.price).toString());
            setUsdAmountPromedio(truncateToTwoDecimals(bsValue / ContextValue.promedioData.price).toString());
            setUsdAmountParalelo(truncateToTwoDecimals(bsValue / ContextValue.paraleloData.price).toString());
        }
    };

    const handleDollarBlur = () => {
        if (section === 'BCV') {
            setUsdAmountBcv((prev) => truncateToTwoDecimals(prev).toString());
        } else if (section === 'Promedio') {
            setUsdAmountPromedio((prev) => truncateToTwoDecimals(prev).toString());
        } else if (section === 'Paralelo') {
            setUsdAmountParalelo((prev) => truncateToTwoDecimals(prev).toString());
        } else if (section === 'Equivalent') {
            setUsdAmountBcv((prev) => truncateToTwoDecimals(prev).toString());
            setUsdAmountPromedio((prev) => truncateToTwoDecimals(prev).toString());
            setUsdAmountParalelo((prev) => truncateToTwoDecimals(prev).toString());
        }
    };
    
    const handleBsBlur = () => {
        setBsAmount((prev) => truncateToTwoDecimals(prev).toString());
    };

    function ReactHotToastNotification_valueCopiedSuccessfully(value) {
        navigator.clipboard.writeText(value)
            .then(() => {
                toast.success('¡Copiado en el portapapeles!')
            })
            .catch((error) => {
                console.error("Error al copiar al portapapeles:", error);
            });
      }

    const sectionCalculator = () => {
        if (section === 'Equivalent') {
            return (
                <>
                    <div className="relative mt-2 rounded-md shadow-sm">
                        <button onClick={() => ReactHotToastNotification_valueCopiedSuccessfully(usdAmountBcv)} className="absolute inset-y-0 left-0 flex items-center bg-gray-200 px-3 rounded-l-md text-gray-700 sm:text-sm">
                            <i className="bi bi-copy"></i>
                        </button>
                        <input type="number" step="0.01" min="0" value={usdAmountBcv} name="equivalentInputBcv" onChange={handleInputChangeEquivalent} onBlur={handleDollarBlur} className="rounded-l-md focus:outline-none focus:border-gray-300 block w-full rounded-r-md border-0 py-1.5 pl-12 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" placeholder="0.00" />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                            <span className="text-gray-500 sm:text-sm">USD BCV</span>
                        </div>
                    </div>
                    <div className="relative mt-2 rounded-md shadow-sm">
                        <button onClick={() => ReactHotToastNotification_valueCopiedSuccessfully(usdAmountPromedio)} className="absolute inset-y-0 left-0 flex items-center bg-gray-200 px-3 rounded-l-md text-gray-700 sm:text-sm">
                            <i className="bi bi-copy"></i>
                        </button>
                        <input type="number" step="0.01" min="0" value={usdAmountPromedio} name="equivalentInputPromedio" onChange={handleInputChangeEquivalent} onBlur={handleDollarBlur} className="rounded-l-md focus:outline-none focus:border-gray-300 block w-full rounded-r-md border-0 py-1.5 pl-12 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" placeholder="0.00" />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                            <span className="text-gray-500 sm:text-sm">USD PROMEDIO</span>
                        </div>
                    </div>
                    <div className="relative mt-2 rounded-md shadow-sm">
                        <button onClick={() => ReactHotToastNotification_valueCopiedSuccessfully(usdAmountParalelo)} className="rounded-l-md absolute inset-y-0 left-0 flex items-center bg-gray-200 px-3 text-gray-700 sm:text-sm">
                            <i className="bi bi-copy"></i>
                        </button>
                        <input type="number" step="0.01" min="0" value={usdAmountParalelo} name="equivalentInputParalelo" onChange={handleInputChangeEquivalent} onBlur={handleDollarBlur} className="rounded-l-md focus:outline-none focus:border-gray-300 block w-full rounded-r-md border-0 py-1.5 pl-12 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" placeholder="0.00" />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                            <span className="text-gray-500 sm:text-sm">USD PARALELO</span>
                        </div>
                    </div>
                    <div className="relative mt-2 rounded-md shadow-sm">
                        <button onClick={() => ReactHotToastNotification_valueCopiedSuccessfully(bsAmount)} className="absolute inset-y-0 left-0 flex items-center bg-gray-200 px-3 rounded-l-md text-gray-700 sm:text-sm">
                            <i className="bi bi-copy"></i>
                        </button>
                        <input type="number" step="0.01" min="0" value={bsAmount} onChange={handleBsChange} onBlur={handleBsBlur} className="rounded-l-md focus:outline-none focus:border-gray-300 block w-full rounded-r-md border-0 py-1.5 pl-12 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" placeholder="0.00" />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                            <span className="text-gray-500 sm:text-sm">BS.</span>
                        </div>
                    </div>
                </>
            );
        } else {
            return (
                <>
                    <div className="relative mt-2 rounded-md shadow-sm">
                        <button onClick={() => ReactHotToastNotification_valueCopiedSuccessfully(section === 'BCV' ? usdAmountBcv : section === 'Promedio' ? usdAmountPromedio : usdAmountParalelo)} className="absolute inset-y-0 left-0 flex items-center bg-gray-200 px-3 rounded-l-md text-gray-700 sm:text-sm">
                            <i className="bi bi-copy"></i>
                        </button>
                        <input type="number" step="0.01" min="0" value={section === 'BCV' ? usdAmountBcv : section === 'Promedio' ? usdAmountPromedio : usdAmountParalelo} onChange={handleDollarChange} onBlur={handleDollarBlur} className="rounded-l-md focus:outline-none focus:border-gray-300 block w-full rounded-r-md border-0 py-1.5 pl-12 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" placeholder="0.00" />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                            <span className="text-gray-500 sm:text-sm">USD</span>
                        </div>
                    </div>
                    <div className="relative mt-2 rounded-md shadow-sm">
                        <button onClick={() => ReactHotToastNotification_valueCopiedSuccessfully(bsAmount)} className="absolute inset-y-0 left-0 flex items-center bg-gray-200 px-3 rounded-l-md text-gray-700 sm:text-sm">
                            <i className="bi bi-copy"></i>
                        </button>
                        <input type="number" step="0.01" min="0" value={bsAmount} onChange={handleBsChange} onBlur={handleBsBlur} className="rounded-l-md focus:outline-none focus:border-gray-300 block w-full rounded-r-md border-0 py-1.5 pl-12 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" placeholder="0.00" />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                            <span className="text-gray-500 sm:text-sm">BS.</span>
                        </div>
                    </div>
                </>
            );
        }
    };

    return (
        <>
        <img src='../assets/img/banner.png' className='mb-5 rounded-md shadow-sm'></img>
        <div className='bg-gray-800 text-white p-4 rounded-md'>
            <h1 className='text-xl font-bold text-center'>aBCV - Calculadora</h1>
            <p className='text-gray-500 text-sm mb-3 text-center'>Pruébala gratis en: abcv.vercel.app</p>
            <div className='text-center mb-2'>
                <select onChange={ChangeSection} className="w-100 h-full rounded-md border-0  py-0 pl-2 pr-7 text-gray-500 sm:text-sm">
                    <option value="BCV">BCV</option>
                    <option value="Promedio">Promedio</option>
                    <option value="Paralelo">Paralelo</option>
                    <option value="Equivalent">Equivalentes</option>
                </select> <br />
            </div>
            {sectionCalculator()}
            <p className='text-gray-500 text-sm mt-3 text-center'>
                ÚLTIMA ACTUALIZACIÓN <br />
                {lastUpdated ? lastUpdated : ''}
            </p>
        </div>
        <div className='text-center text-gray-500 mt-1'>
            <a href="https://github.com/itsJefryTz/aBCV" target='_blank'><i className="bi bi-github"></i></a>
        </div>
        </>
    );
}
