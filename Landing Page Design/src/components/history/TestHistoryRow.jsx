function TestHistoryRow({ test }) {
  return (
    <tr>
      <td>{test.date}</td>
      <td>{test.glucose}</td>
      <td>{test.protein}</td>
      <td>{test.ph.toFixed(1)}</td>
      <td>{test.ketones}</td>
      <td>{test.blood}</td>
    </tr>
  );
}

export default TestHistoryRow;
