import { FaThLarge, FaFilter } from 'react-icons/fa';

const TabSwitcher = ({ activeTab, setActiveTab }) => {
  return (
    <div className="inline-flex border border-gray-300 rounded-lg overflow-hidden mb-4">
      <button
        onClick={() => setActiveTab('cards')}
        className={`px-4 py-2.5 text-xs font-medium flex items-center gap-2 transition 
          ${activeTab === 'cards' ? 'bg-gray-800 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'} 
          rounded-l-lg`}
      >
        <FaThLarge />
        Cards
      </button>
      <button
        onClick={() => setActiveTab('filters')}
        className={`px-4 py-2.5 text-xs font-medium flex items-center gap-2 transition 
          ${activeTab === 'filters' ? 'bg-gray-800 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'} 
          rounded-r-lg`}
      >
        <FaFilter />
        Filters
      </button>
    </div>
  );
};

export default TabSwitcher;
