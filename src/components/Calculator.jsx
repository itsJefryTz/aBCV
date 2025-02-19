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
                setBsAmount(formatNumberWithComma(truncateToTwoDecimals(ContextValue.bcvData.price).toString()));
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
            setBsAmount(formatNumberWithComma(truncateToTwoDecimals((ContextValue.bcvData.price).toString())));
            setLastUpdated((ContextValue.bcvData.last_update).replace(',', ' |'))
        } else if (sectionValue === 'Promedio') {
            setUsdAmountPromedio('1')
            setBsAmount(formatNumberWithComma(truncateToTwoDecimals((ContextValue.promedioData.price).toString())));
            setLastUpdated((ContextValue.promedioData.last_update).replace(',', ' |'))
        } else if (sectionValue === 'Paralelo') {
            setUsdAmountParalelo('1')
            setBsAmount(formatNumberWithComma(truncateToTwoDecimals((ContextValue.paraleloData.price).toString())));
            setLastUpdated((ContextValue.paraleloData.last_update).replace(',', ' |'))
        } else if (sectionValue === 'Equivalent') {
            setUsdAmountBcv('1')
            const resultBcv = (ContextValue.bcvData.price);
            setBsAmount(formatNumberWithComma(truncateToTwoDecimals(resultBcv).toString()));
            const resultPromedio = (formatNumberWithComma(truncateToTwoDecimals(resultBcv / ContextValue.promedioData.price).toString()));
            setUsdAmountPromedio(resultPromedio);
            const resultParalelo = (formatNumberWithComma(truncateToTwoDecimals(resultBcv / ContextValue.paraleloData.price).toString()));
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

    const formatNumberWithComma = (value) => {
        const number = parseFloat(value);
        if (isNaN(number)) return '0,00';
    
        const [integerPart, decimalPart] = number.toString().split('.');
        const formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        const formattedDecimalPart = decimalPart ? (decimalPart.length === 1 ? `${decimalPart}0` : decimalPart.slice(0, 2)) : '00';
    
        return `${formattedIntegerPart},${formattedDecimalPart}`;
    };

    const isFormattedNumberWithComma = (value) => {
        const regex = /^\d{1,3}(\.\d{3})*(,\d{2})?$/;
        return regex.test(value);
    };

    const formatNumberWithCommaIfNeeded = (value) => {
        if (!isFormattedNumberWithComma(value)) {
            return formatNumberWithComma(value.replace(',', '.'));
        }
        return value;
    };

    const convertToNumber = (value) => {
        const normalizedValue = value.replace(/[.]/g, '').replace(',', '.');
        return normalizedValue;
    };

    const handleDollarChange = (e) => {
        const dollarValue = e.target.value.replace(/[^0-9,]/g, '');
        const dollarValueUnformatted = convertToNumber(dollarValue);
        section === 'BCV' ? setUsdAmountBcv(dollarValue) : section === 'Promedio' ? setUsdAmountPromedio(dollarValue) : setUsdAmountParalelo(dollarValue);
        if (section === 'BCV' && ContextValue.bcvData.price) {
            setBsAmount(formatNumberWithComma(truncateToTwoDecimals(dollarValueUnformatted * ContextValue.bcvData.price).toString()));
        } else if (section === 'Promedio' && ContextValue.promedioData.price) {
            setBsAmount(formatNumberWithComma(truncateToTwoDecimals(dollarValueUnformatted * ContextValue.promedioData.price).toString()));
        } else if (section === 'Paralelo' && ContextValue.paraleloData.price) {
            setBsAmount(formatNumberWithComma(truncateToTwoDecimals(dollarValueUnformatted * ContextValue.paraleloData.price).toString()));
        }
    };

    const handleBsChange = (e) => {
        const bsValue = e.target.value.replace(/[^0-9,]/g, '');
        const bsValueUnformatted = convertToNumber(bsValue);
        setBsAmount(bsValue);
        if (section === 'BCV' && ContextValue.bcvData.price) {
            setUsdAmountBcv(formatNumberWithComma(truncateToTwoDecimals(bsValueUnformatted / ContextValue.bcvData.price).toString()));
        } else if (section === 'Promedio' && ContextValue.promedioData.price) {
            setUsdAmountPromedio(formatNumberWithComma(truncateToTwoDecimals(bsValueUnformatted / ContextValue.promedioData.price).toString()));
        } else if (section === 'Paralelo' && ContextValue.paraleloData.price) {
            setUsdAmountParalelo(formatNumberWithComma(truncateToTwoDecimals(bsValueUnformatted / ContextValue.paraleloData.price).toString()));
        } else if (section === 'Equivalent' && ContextValue.paraleloData.price) {
            setUsdAmountBcv(formatNumberWithComma(truncateToTwoDecimals(bsValueUnformatted / ContextValue.bcvData.price).toString()));
            setUsdAmountPromedio(formatNumberWithComma(truncateToTwoDecimals(bsValueUnformatted / ContextValue.promedioData.price).toString()));
            setUsdAmountParalelo(formatNumberWithComma(truncateToTwoDecimals(bsValueUnformatted / ContextValue.paraleloData.price).toString()));
        }
    };

    const handleInputChangeEquivalent = (e) => {
        const { name } = e.target;
        const value = e.target.value.replace(/[^0-9,]/g, '');
        const valueUnformatted = convertToNumber(value);
        if (name === 'equivalentInputBcv') {
            setUsdAmountBcv(value);
            setBsAmount(truncateToTwoDecimals(valueUnformatted * ContextValue.bcvData.price).toString());
            setUsdAmountPromedio(formatNumberWithComma(truncateToTwoDecimals((valueUnformatted * ContextValue.bcvData.price) / ContextValue.promedioData.price).toString()));
            setUsdAmountParalelo(formatNumberWithComma(truncateToTwoDecimals((valueUnformatted * ContextValue.bcvData.price) / ContextValue.paraleloData.price).toString()));
        } else if (name === 'equivalentInputPromedio') {
            setUsdAmountPromedio(value);
            setBsAmount(formatNumberWithComma(truncateToTwoDecimals(valueUnformatted * ContextValue.promedioData.price).toString()));
            setUsdAmountBcv(formatNumberWithComma(truncateToTwoDecimals((valueUnformatted * ContextValue.promedioData.price) / ContextValue.bcvData.price).toString()));
            setUsdAmountParalelo(formatNumberWithComma(truncateToTwoDecimals((valueUnformatted * ContextValue.promedioData.price) / ContextValue.paraleloData.price).toString()));
        } else if (name === 'equivalentInputParalelo') {
            setUsdAmountParalelo(value);
            setBsAmount(formatNumberWithComma(truncateToTwoDecimals(valueUnformatted * ContextValue.paraleloData.price).toString()));
            setUsdAmountBcv(formatNumberWithComma(truncateToTwoDecimals((valueUnformatted * ContextValue.paraleloData.price) / ContextValue.bcvData.price).toString()));
            setUsdAmountPromedio(formatNumberWithComma(truncateToTwoDecimals((valueUnformatted * ContextValue.paraleloData.price) / ContextValue.promedioData.price).toString()));
        }
    }

    const handleDollarBlur = (e) => {
        const { name, value } = e.target;
        if (section === 'BCV') {
            setUsdAmountBcv(formatNumberWithCommaIfNeeded(value.toString()));
        } else if (section === 'Promedio') {
            setUsdAmountPromedio(formatNumberWithCommaIfNeeded(value.toString()));
        } else if (section === 'Paralelo') {
            setUsdAmountParalelo(formatNumberWithCommaIfNeeded(value.toString()));
        } else if (section === 'Equivalent') {
            if (name === 'equivalentInputBcv') {
                setUsdAmountBcv(formatNumberWithCommaIfNeeded(value.toString()));
            } else if (name === 'equivalentInputPromedio') {
                setUsdAmountPromedio(formatNumberWithCommaIfNeeded(value.toString()));
            } else if (name === 'equivalentInputParalelo') {
            setUsdAmountParalelo(formatNumberWithCommaIfNeeded(value.toString()));
            }
        }
    };
    
    const handleBsBlur = (e) => {
        setBsAmount(formatNumberWithCommaIfNeeded(e.target.value.toString()));
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
                        <input value={usdAmountBcv} name="equivalentInputBcv" onChange={handleInputChangeEquivalent} onBlur={handleDollarBlur} className="rounded-l-md focus:outline-none focus:border-gray-300 block w-full rounded-r-md border-0 py-1.5 pl-12 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" placeholder="0.00" />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                            <span className="text-gray-500 sm:text-sm">USD BCV</span>
                        </div>
                    </div>
                    <div className="relative mt-2 rounded-md shadow-sm">
                        <button onClick={() => ReactHotToastNotification_valueCopiedSuccessfully(usdAmountPromedio)} className="absolute inset-y-0 left-0 flex items-center bg-gray-200 px-3 rounded-l-md text-gray-700 sm:text-sm">
                            <i className="bi bi-copy"></i>
                        </button>
                        <input value={usdAmountPromedio} name="equivalentInputPromedio" onChange={handleInputChangeEquivalent} onBlur={handleDollarBlur} className="rounded-l-md focus:outline-none focus:border-gray-300 block w-full rounded-r-md border-0 py-1.5 pl-12 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" placeholder="0.00" />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                            <span className="text-gray-500 sm:text-sm">USD PROMEDIO</span>
                        </div>
                    </div>
                    <div className="relative mt-2 rounded-md shadow-sm">
                        <button onClick={() => ReactHotToastNotification_valueCopiedSuccessfully(usdAmountParalelo)} className="rounded-l-md absolute inset-y-0 left-0 flex items-center bg-gray-200 px-3 text-gray-700 sm:text-sm">
                            <i className="bi bi-copy"></i>
                        </button>
                        <input value={usdAmountParalelo} name="equivalentInputParalelo" onChange={handleInputChangeEquivalent} onBlur={handleDollarBlur} className="rounded-l-md focus:outline-none focus:border-gray-300 block w-full rounded-r-md border-0 py-1.5 pl-12 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" placeholder="0.00" />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                            <span className="text-gray-500 sm:text-sm">USD PARALELO</span>
                        </div>
                    </div>
                    <div className="relative mt-2 rounded-md shadow-sm">
                        <button onClick={() => ReactHotToastNotification_valueCopiedSuccessfully(bsAmount)} className="absolute inset-y-0 left-0 flex items-center bg-gray-200 px-3 rounded-l-md text-gray-700 sm:text-sm">
                            <i className="bi bi-copy"></i>
                        </button>
                        <input value={bsAmount} onChange={handleBsChange} onBlur={handleBsBlur} className="rounded-l-md focus:outline-none focus:border-gray-300 block w-full rounded-r-md border-0 py-1.5 pl-12 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" placeholder="0.00" />
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
                        <input type="text" value={section === 'BCV' ? usdAmountBcv : section === 'Promedio' ? usdAmountPromedio : usdAmountParalelo} onChange={handleDollarChange} onBlur={handleDollarBlur} className="rounded-l-md focus:outline-none focus:border-gray-300 block w-full rounded-r-md border-0 py-1.5 pl-12 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" placeholder="0.00" />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                            <span className="text-gray-500 sm:text-sm">USD</span>
                        </div>
                    </div>
                    <div className="relative mt-2 rounded-md shadow-sm">
                        <button onClick={() => ReactHotToastNotification_valueCopiedSuccessfully(bsAmount)} className="absolute inset-y-0 left-0 flex items-center bg-gray-200 px-3 rounded-l-md text-gray-700 sm:text-sm">
                            <i className="bi bi-copy"></i>
                        </button>
                        <input type="text" value={bsAmount} onChange={handleBsChange} onBlur={handleBsBlur} className="rounded-l-md focus:outline-none focus:border-gray-300 block w-full rounded-r-md border-0 py-1.5 pl-12 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" placeholder="0.00" />
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
        <img src='/banner.png' className='mb-5 rounded-md shadow-sm'></img>
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
