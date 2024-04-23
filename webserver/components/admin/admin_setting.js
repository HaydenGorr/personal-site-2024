import Container from "../container";

export default function AdminSetting({ title, children }) {

    return (
        <div className="flex flex-col Neo-Brutal px-3 py-2 w-fit">
            <div>
                {title}
            </div>
            <div>
                {children}
            </div>
        </div>
    );

  }