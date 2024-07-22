function MarkerList(props){
    return (
                    <ul className="list-group">
                        {
                            <table className="table table-striped">
                                <thead>
                                <tr>
                                    <th scope="col">ID</th>
                                    <th scope="col">Latitude</th>
                                    <th scope="col">Longitude</th>
                                    <th scope="col">Unit</th>
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    props.markers.map(item =>
                                        <tr>
                                            <th scope="row">{item.id}</th>
                                            <td>{item.lat}</td>
                                            <td>{item.lng}</td>
                                            <td>{item.device}</td>
                                        </tr>
                                    )

                                }

                                </tbody>
                            </table>
                        }
                    </ul>
                


    )



}
export default MarkerList;
