<script lang="ts">
    import UploadedItem from "../components/upload/UploadedItem.svelte";

    interface Model {
        name: string;
        size: number;
        unit_size: string;
        id: string;
    }

    let models: Model[] = [
        {
            name: "CNN - LeNet-5",
            size: 86,
            unit_size: "kb",
            id: "1",
        },
        {
            name: "CNN - VGG-Net",
            size: 452,
            unit_size: "kb",
            id: "2",
        },
        {
            name: "RNN - GRU",
            size: 896,
            unit_size: "kb",
            id: "3",
        },
        {
            name: "LSTM - Bidirectional LSTM",
            size: 345,
            unit_size: "kb",
            id: "4",
        },
        {
            name: "RNN - Simple GRU",
            size: 785,
            unit_size: "kb",
            id: "5",
        },
        {
            name: "LSTM - Simple LSTM",
            size: 123,
            unit_size: "kb",
            id: "6",
        },
        {
            name: "Deep Neural Network",
            size: 4.21,
            unit_size: "mb",
            id: "7",
        },
    ];

    interface Data {
        name: string;
        size: number;
        unit_size: string;
        id: string;
    }

    let datafiles: Data[] = [
        {
            name: "MNIST",
            size: 1.12,
            unit_size: "gb",
            id: "1",
        },
        {
            name: "20 Newsgroups",
            size: 2.25,
            unit_size: "gb",
            id: "2",
        },
        {
            name: "CIFAR-10",
            size: 3.45,
            unit_size: "gb",
            id: "3",
        },
        {
            name: "CIFAR-100",
            size: 9.78,
            unit_size: "gb",
            id: "4",
        },
        {
            name: "Fashion MNIST",
            size: 895,
            unit_size: "mb",
            id: "5",
        },
        {
            name: "IMDB",
            size: 54.12,
            unit_size: "gb",
            id: "6",
        },
        {
            name: "Reuters",
            size: 14.78,
            unit_size: "gb",
            id: "7",
        },
        {
            name: "Titanic",
            size: 485,
            unit_size: "mb",
            id: "8",
        },
        {
            name: "Wine",
            size: 1.45,
            unit_size: "mb",
            id: "9",
        },
        {
            name: "Boston Housing",
            size: 1.78,
            unit_size: "mb",
            id: "10",
        },
        {
            name: "Iris",
            size: 1.12,
            unit_size: "mb",
            id: "11",
        },
        {
            name: "Digits",
            size: 1.45,
            unit_size: "mb",
            id: "12",
        },
        {
            name: "Breast Cancer",
            size: 1.38,
            unit_size: "mb",
            id: "13",
        }
    ];

    function removeModel(modelName: string) {
        models = models.filter((model) => model.name !== modelName);
    }

    function removeData(modelName: string) {
        datafiles = datafiles.filter((datafile) => datafile.name !== modelName);
    }
</script>

<div class="relative grid items-center max-w-[1400px] mx-auto w-full text-sm sm:text-base min-h-screen -mt-[76px]">
    <div class="flex flex-col items-center justify-self-center w-full bg-[#15223C] rounded-3xl py-[34px] h-[75vh]">
        <div class="flex items-start justify-between w-full px-[34px] gap-[55px]">
            <div class="w-1/2">
                <div class="flex items-center justify-between w-full">
                    <div class="font-medium text-3xl">Models uploaded</div>
                    <a href="/upload_model">
                        <svg class="w-[26px] h-[26px] text-white" viewBox="0 0 448 512">
                            <path fill="#ffffff" d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"/>
                        </svg>
                    </a>
                </div>
                {#if models}
                    <div class="relative flex flex-col gap-[13px] mt-[21px] max-h-[calc(75vh-6rem)] overflow-auto pr-[21px]">
                        {#each models as model}
                            <UploadedItem {...model} eye={true} on:remove={(e) => removeModel(e.detail)} />
                        {/each}
                    </div>
                {/if}
            </div>
            <div class="w-1/2">
                <div class="flex items-center justify-between w-full">
                    <div class="font-medium text-3xl">Datafiles uploaded</div>
                    <a href="/upload_data">
                        <svg class="w-[26px] h-[26px] text-white" viewBox="0 0 448 512">
                            <path fill="#ffffff" d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"/>
                        </svg>
                    </a>
                </div>
                {#if models}
                <div class="relative flex flex-col gap-[13px] mt-[21px] max-h-[calc(75vh-6rem)] overflow-auto pr-[21px]">
                        {#each datafiles as datafile}
                            <UploadedItem {...datafile} eye={false} on:remove={(e) => removeData(e.detail)} />
                        {/each}
                    </div>
                {/if}
            </div>
        </div>
    </div>
</div>

<style>
    ::-webkit-scrollbar {
        width: 12px; /* largeur de la scrollbar */
    }

    ::-webkit-scrollbar-track {
        background: #1e293b; /* couleur de l'arrière-plan de la scrollbar */
    }

    ::-webkit-scrollbar-thumb {
        background-color: #64748b; /* couleur de la poignée de la scrollbar */
        border-radius: 20px; /* arrondi des angles de la poignée de la scrollbar */
        border: 3px solid #1e293b; /* bordure et couleur séparant la poignée de la track */
    }
</style>
