export default function AddTodo()
{
    return (
        <>
            <div className="p-5">
                <h2 className="text-center">Create Todo</h2>
                <div className="p-5">
                    <div className="">
                        <label htmlFor="task" className="block">task</label>
                        <input className="block"  type="text" name="task" id="task " placeholder="enter your task"/>
                    </div>
                    <div>
                        <button className="text-center">Create</button>
                    </div>
                </div>
            </div>
        </>
    );
}