
const CustomizeTabs = () => {
    return (
        <TabGroup>
            <TabList className="flex gap-2">
                <Tab className="rounded-full py-1 px-3 text-sm/6 font-semibold focus:outline-none data-[selected]:bg-black/10 data-[hover]:bg-black/5 data-[selected]:data-[hover]:bg-black/10 data-[focus]:outline-1 data-[focus]:outline-white">
                    Instructions
                </Tab>
                <Tab className="rounded-full py-1 px-3 text-sm/6 font-semibold focus:outline-none data-[selected]:bg-black/10 data-[hover]:bg-black/5 data-[selected]:data-[hover]:bg-black/10 data-[focus]:outline-1 data-[focus]:outline-white">
                    Retrieval
                </Tab>
                <Tab className="rounded-full py-1 px-3 text-sm/6 font-semibold focus:outline-none data-[selected]:bg-black/10 data-[hover]:bg-black/5 data-[selected]:data-[hover]:bg-black/10 data-[focus]:outline-1 data-[focus]:outline-white">
                    Tools
                </Tab>
            </TabList>
            <TabPanels className={"mt-3"}>
                <TabPanel>
                    <p className="mt-1 mb-2 text-sm">
                        What would you like ChatGPT to know about you to provide
                        better responses?
                    </p>
                    <textarea
                        className="w-full resize-y rounded-sm p-2 placeholder:text-gray-300 border text-sm"
                        rows={6}
                        value={textareaValue}
                        onChange={(e) => setTextareaValue(e.target.value)}
                    />
                </TabPanel>
                <TabPanel>
                    <RetrievalForm />
                </TabPanel>
                <TabPanel>
                    <ul>
                        <li>Playwright</li>
                    </ul>
                    <ul>
                        <li>Github</li>
                    </ul>
                    <ul>
                        <li>Loader</li>
                    </ul>
                </TabPanel>
            </TabPanels>
        </TabGroup>
    );
}

export default CustomizeTabs;