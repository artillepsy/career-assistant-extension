export function CurrentJobPage() {
  const [analysisResult, setAnalysisResult] = useState('Waiting for the result...');

  useEffect(() => {
    const fetchData = async () => {
      await browser.storage.local.get('jobAnalysis').then((result) => {
        if (result.jobAnalysis) {
          setAnalysisResult(result.jobAnalysis ?? 'failed to get the key');
        }
      });
    };
    // listen to the storage changes

    fetchData();
  }, []);

  return (
    <>
      <h1>Message from the browser</h1>
      <p>{analysisResult}</p>
    </>
  );
}
