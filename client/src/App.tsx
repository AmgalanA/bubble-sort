import { useEffect, useRef, useState } from "react";

function App() {
  interface SortType {
    id: number;
    sorted_result: [number],
  }

  const [values, setValues] = useState('');
  const [resultArray, setResultArray] = useState<SortType[]>([]);
  const [specificSort, setSpecificSort] = useState<SortType>();
  const [isShowingSpecificSort, setIsShowingSpecificSort] = useState<Boolean>(false);
  const [isLoading, setIsLoading] = useState<Boolean>(false);
  const [message, setMessage] = useState<String>('');

  const startOfAppRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const getSortResults = async () => {
      const showSortedArrayResponse = await fetch("http://localhost:5000/sort");
      
      const jsonValue = await showSortedArrayResponse.json();
      
      setResultArray(jsonValue);
    };

    getSortResults();
  }, [resultArray]);

  const sortArray = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    const splittedValues: number[] = values.split(' ')
    .map(Number)
    
    // Bubble sort
    for (let n = 0; n < splittedValues.length; n++) {
      for (let i = 0; i < splittedValues.length - 1 - n; i++) {
        if(splittedValues[i] > splittedValues[i + 1]) {
          const buff  = splittedValues[i];
          splittedValues[i] = splittedValues[i + 1];
          splittedValues[i + 1] = buff;
        }
      }
    }

    try {
      // Create unique id
      const id = Math.floor(Math.random() * 10000000);
      
      const body = { id, splittedValues }
      
      await fetch("http://localhost:5000/sort", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
    } catch (error) {
      console.log(error);
    }

    setValues('');
  };

  const getSpecificSortResult = async (id: number) => {
    try {
      const specificSort = await fetch(`http://localhost:5000/sort/${id}`);

      
      const jsonSpecificSort = await specificSort.json();
      
      setSpecificSort(jsonSpecificSort);
      setIsShowingSpecificSort(true);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteSort = async (id: number) => {
    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:5000/sort/${id}`, {
        method: 'DELETE',
      });

      const jsonResponse = await response.json();

      setIsLoading(false);

      setIsShowingSpecificSort(false);

      setMessage(jsonResponse);
      scrollToViewMessage();
    } catch (error) {
      console.log(error);
    }
  };

  const scrollToViewMessage = () => {
    startOfAppRef?.current?.scrollIntoView({
      behavior: 'smooth'
    })
  };

  return (
    <div className="h-screen bg-gray-50 flex items-center justify-center">
    <div className="bg-gray-100 overflow-y-scroll p-10 pt-3 max-h-[50%] w-[60%] lg:w-[40%] flex flex-col space-y-4">
      <div ref={startOfAppRef} />
      {message && (
        <div className="relative bg-green-400 font-semibold p-3 rounded-lg text-white text-sm text-center">
          <div className="absolute top-1 right-1 text-xs cursor-pointer" onClick={() => setMessage('')}>❌</div>
          <h1>{message}</h1>
        </div>
      )}
      
      <form onSubmit={sortArray} className='w-full flex flex-col'>
        <input type='text' value={values} onChange={e => setValues(e.target.value)} className='placeholder:text-sm outline-none bg-transparent border-2 p-2' placeholder="Enter values for bubble sort (divide values with spacebar)" />
        <button className='bg-gray-300 font-semibold py-2 hover:bg-gray-400' type='submit'>Sort</button>
      </form>

      {/* Toggle showing specific sort modal */}
      {isShowingSpecificSort && specificSort && (
        <div className='h-screen inset-0 z-1 fixed top-0 w-full bg-gray-400 bg-opacity-20'>
          <div className='mx-auto py-10 relative mt-10 border-2 bg-white rounded-lg w-[100%] md:w-[60%] flex flex-col space-y-4 items-center'>
            <div onClick={() => !isLoading ? setIsShowingSpecificSort(false) : {}} className='cursor-pointer absolute right-2 top-2'>
            ❌
            </div>
            <h1 className='font-semibold text-lg'>Specific Sort</h1>
            <div>
              {specificSort.sorted_result.map((number, i) => (
                <span key={i} className='font-semibold'>{number}{' '}</span>
              ))}
            </div>
            <span onClick={() => deleteSort(specificSort.id)} className='bg-red-500 cursor-pointer hover:bg-black font-semibold px-5 py-2 rounded-full text-white'>Delete</span>
          </div>
        </div>
      )}

      {/* Sort result */}
      <h1 className='text-center font-semibold'>All Bubble Sort Results: </h1>
      <div className='flex flex-col-reverse'>
        {/* {resultArray?.map(result => (
          <div key={result.id}>
            {result.sorted_array.map(number => (
              <span>{number}</span>
            ))}
          </div>
        ))} */}
        {Object.values(resultArray).map((result, i) => (
          <div onClick={() => getSpecificSortResult(result.id)} key={result.id} className='mb-3 px-3 cursor-pointer hover:bg-gray-300 bg-gray-200 py-3 rounded-lg font-semibold text-center truncate'>
              {result.sorted_result.map((number, i) => (
                <>
                <span>{number}{' '}</span>
                </>
              ))}
          </div>
        ))}
      </div>
    </div>
    </div>
  )
}

export default App
