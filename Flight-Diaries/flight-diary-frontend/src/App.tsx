import { useEffect, useState } from 'react';
import './App.css';

// DiaryEntry type matches backend
export interface DiaryEntry {
  id: number;
  date: string;
  weather: string;
  visibility: string;
  comment: string;
}


const initialForm = {
  date: '',
  weather: '',
  visibility: '',
  comment: '',
};

const App = () => {
  const [diaries, setDiaries] = useState<DiaryEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchDiaries = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/diaries');
        if (!response.ok) {
          throw new Error('Failed to fetch diaries');
        }
        const data: DiaryEntry[] = await response.json();
        setDiaries(data);
      } catch (e) {
        setError((e as Error).message);
      }
    };
    fetchDiaries();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:3000/api/diaries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText || 'Failed to add diary');
      }
      const newDiary: DiaryEntry = await response.json();
      setDiaries([newDiary, ...diaries]);
      setForm(initialForm);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="App">
      <h1>Flight Diaries</h1>
      <form onSubmit={handleSubmit} style={{ marginBottom: '2em', border: '1px solid #ccc', padding: '1em', borderRadius: '8px', maxWidth: 400 }}>
        <div>
          <label>Date: <input type="date" name="date" value={form.date} onChange={handleChange} required /></label>
        </div>
        <div>
          <label>Weather: 
            <select name="weather" value={form.weather} onChange={handleChange} required>
              <option value="">Select</option>
              <option value="sunny">Sunny</option>
              <option value="rainy">Rainy</option>
              <option value="cloudy">Cloudy</option>
              <option value="stormy">Stormy</option>
              <option value="windy">Windy</option>
            </select>
          </label>
        </div>
        <div>
          <label>Visibility: 
            <select name="visibility" value={form.visibility} onChange={handleChange} required>
              <option value="">Select</option>
              <option value="great">Great</option>
              <option value="good">Good</option>
              <option value="ok">Ok</option>
              <option value="poor">Poor</option>
            </select>
          </label>
        </div>
        <div>
          <label>Comment: <textarea name="comment" value={form.comment} onChange={handleChange} required rows={2} style={{ width: '100%' }} /></label>
        </div>
        <button type="submit" disabled={submitting} style={{ marginTop: '1em' }}>Add Diary</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {diaries.map((diary) => (
          <li key={diary.id} style={{ marginBottom: '1em' }}>
            <strong>{diary.date}</strong> - Weather: {diary.weather}, Visibility: {diary.visibility}
            <br />
            <em>Comment:</em> {diary.comment}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
